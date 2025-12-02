import Transaksi from '#models/transaksi'
import Produk from '#models/produk'
import Operasional from '#models/operasional'
import CashBook from '#models/cash_book'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export class RekapService {
  /**
   * Get comprehensive rekap (summary) report
   */
  async getRekap(startDate?: DateTime, endDate?: DateTime) {
    const dateFilter = this.buildDateFilter(startDate, endDate)

    const [rekapPenjualan, rekapProduk, rekapOperasional, rekapKeuangan, rekapCashBook] =
      await Promise.all([
        this.getRekapPenjualan(dateFilter),
        this.getRekapProduk(),
        this.getRekapOperasional(),
        this.getRekapKeuangan(dateFilter),
        this.getRekapCashBook(dateFilter),
      ])

    return {
      periode: {
        startDate: startDate?.toISODate() || null,
        endDate: endDate?.toISODate() || null,
      },
      penjualan: rekapPenjualan,
      produk: rekapProduk,
      operasional: rekapOperasional,
      keuangan: rekapKeuangan,
      cashBook: rekapCashBook,
      summary: {
        totalPendapatan: rekapPenjualan.totalRevenue + rekapCashBook.totalMasuk,
        totalPengeluaran: rekapOperasional.totalCost + rekapCashBook.totalKeluar,
        labaBersih:
          rekapPenjualan.totalRevenue +
          rekapCashBook.totalMasuk -
          rekapOperasional.totalCost -
          rekapCashBook.totalKeluar,
      },
    }
  }

  /**
   * Get rekap penjualan
   */
  async getRekapPenjualan(dateFilter?: string) {
    let query = Transaksi.query().where('status', 'success')

    if (dateFilter) {
      query = query.whereRaw(dateFilter.replace('1=1 AND', ''))
    }

    const [total, revenue, transactions] = await Promise.all([
      query.clone().count('* as total'),
      query.clone().sum('total as revenue'),
      query.clone().preload('productRelation').orderBy('created_at', 'desc').limit(100),
    ])

    const paymentMethods = await query
      .clone()
      .select('payment_method')
      .count('* as count')
      .sum('total as amount')
      .whereNotNull('payment_method')
      .groupBy('payment_method')

    return {
      totalTransactions: Number(total[0].$extras.total),
      totalRevenue: Number(revenue[0].$extras.revenue || 0),
      paymentMethods: paymentMethods.map((row) => ({
        method: row.paymentMethod,
        count: Number(row.$extras.count),
        amount: Number(row.$extras.amount),
      })),
      recentTransactions: transactions,
    }
  }

  /**
   * Get rekap produk
   */
  async getRekapProduk() {
    const [total, lowStock, totalValue] = await Promise.all([
      Produk.query().count('* as total'),
      Produk.query().where('stock', '<', 10).count('* as total'),
      Produk.query().sum(db.raw('price * stock as total')),
    ])

    const topProducts = await Produk.query().orderBy('stock', 'desc').limit(10)

    return {
      totalProducts: Number(total[0].$extras.total),
      lowStockProducts: Number(lowStock[0].$extras.total),
      totalInventoryValue: Number(totalValue[0]?.$extras.total || 0),
      topProducts: topProducts.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        price: p.price,
        value: p.stock * p.price,
      })),
    }
  }

  /**
   * Get rekap operasional
   */
  async getRekapOperasional() {
    const operasionals = await Operasional.query()

    const monthly = operasionals.filter((o) => o.priode === 'monthly')
    const annual = operasionals.filter((o) => o.priode === 'annual')

    const totalMonthly = monthly.reduce((sum, o) => sum + Number(o.price), 0)
    const totalAnnual = annual.reduce((sum, o) => sum + Number(o.price), 0)
    const totalCost = operasionals.reduce((sum, o) => sum + Number(o.price), 0)

    return {
      totalMonthly,
      totalAnnual,
      totalCost,
      count: operasionals.length,
      monthlyCosts: monthly.map((o) => ({
        id: o.id,
        name: o.name,
        price: o.price,
        description: o.description,
      })),
      annualCosts: annual.map((o) => ({
        id: o.id,
        name: o.name,
        price: o.price,
        description: o.description,
      })),
    }
  }

  /**
   * Get rekap keuangan
   */
  async getRekapKeuangan(dateFilter?: string) {
    let transactionQuery = Transaksi.query().where('status', 'success')

    if (dateFilter) {
      transactionQuery = transactionQuery.whereRaw(dateFilter.replace('1=1 AND', ''))
    }

    const revenue = await transactionQuery.sum('total as revenue')

    const operasionals = await Operasional.query()
    const totalOperasional = operasionals.reduce((sum, o) => sum + Number(o.price), 0)

    return {
      totalRevenue: Number(revenue[0]?.$extras.revenue || 0),
      totalOperasional,
      netIncome: Number(revenue[0]?.$extras.revenue || 0) - totalOperasional,
    }
  }

  /**
   * Get rekap cash book
   */
  async getRekapCashBook(dateFilter?: string) {
    let query = CashBook.query()

    if (dateFilter) {
      const cashBookFilter = dateFilter
        .replace('created_at', 'transaction_date')
        .replace('1=1 AND', '')
      query = query.whereRaw(cashBookFilter)
    }

    const cashBooks = await query

    const totalMasuk = cashBooks
      .filter((cb) => cb.type === 'masuk')
      .reduce((sum, cb) => sum + Number(cb.amount), 0)

    const totalKeluar = cashBooks
      .filter((cb) => cb.type === 'keluar')
      .reduce((sum, cb) => sum + Number(cb.amount), 0)

    return {
      totalMasuk,
      totalKeluar,
      balance: totalMasuk - totalKeluar,
      totalEntries: cashBooks.length,
    }
  }

  /**
   * Build date filter SQL
   */
  private buildDateFilter(startDate?: DateTime, endDate?: DateTime): string | undefined {
    if (!startDate && !endDate) return undefined

    let filter = '1=1'

    if (startDate) {
      const sqlDate = startDate.toSQL()
      if (sqlDate) {
        filter += ` AND created_at >= '${sqlDate}'`
      }
    }

    if (endDate) {
      const sqlDate = endDate.toSQL()
      if (sqlDate) {
        filter += ` AND created_at <= '${sqlDate}'`
      }
    }

    return filter
  }
}
