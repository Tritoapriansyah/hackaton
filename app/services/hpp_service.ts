import Transaksi from '#models/transaksi'
import Produk from '#models/produk'
import Operasional from '#models/operasional'
import { DateTime } from 'luxon'

export class HppService {
  /**
   * Calculate HPP (Harga Pokok Penjualan) for a period
   * Formula: HPP = (Harga Beli × Quantity Terjual) + Biaya Operasional
   */
  async calculateHpp(startDate?: DateTime, endDate?: DateTime) {
    const dateFilter = this.buildDateFilter(startDate, endDate)

    // Get successful transactions
    let transactionQuery = Transaksi.query().where('status', 'success').preload('productRelation')

    if (dateFilter) {
      transactionQuery = transactionQuery.whereRaw(dateFilter)
    }

    const transactions = await transactionQuery

    // Calculate total HPP from products sold
    let totalHppProduk = 0
    const hppPerProduk: Array<{
      productId: number
      productName: string
      quantity: number
      hargaBeli: number
      totalHpp: number
    }> = []

    for (const transaksi of transactions) {
      const product = await Produk.find(transaksi.productId)
      if (product) {
        const hargaBeli = product.hargaBeli || 0
        const hpp = hargaBeli * transaksi.quantity
        totalHppProduk += hpp

        const existing = hppPerProduk.find((p) => p.productId === product.id)
        if (existing) {
          existing.quantity += transaksi.quantity
          existing.totalHpp += hpp
        } else {
          hppPerProduk.push({
            productId: product.id,
            productName: product.name,
            quantity: transaksi.quantity,
            hargaBeli,
            totalHpp: hpp,
          })
        }
      }
    }

    // Get total operasional cost
    const operasionals = await Operasional.query()
    const totalOperasional = operasionals.reduce((sum, o) => sum + Number(o.price), 0)

    // Calculate total revenue
    const revenueQuery = Transaksi.query().where('status', 'success')
    if (dateFilter) {
      revenueQuery.whereRaw(dateFilter)
    }
    const revenue = await revenueQuery.sum('total as revenue')
    const totalRevenue = Number(revenue[0]?.$extras.revenue || 0)

    // Total HPP = HPP Produk + Biaya Operasional
    const totalHpp = totalHppProduk + totalOperasional

    // Laba Kotor = Revenue - HPP Produk
    const labaKotor = totalRevenue - totalHppProduk

    // Laba Bersih = Revenue - Total HPP
    const labaBersih = totalRevenue - totalHpp

    return {
      periode: {
        startDate: startDate?.toISODate() || null,
        endDate: endDate?.toISODate() || null,
      },
      totalRevenue,
      hppProduk: {
        total: totalHppProduk,
        detail: hppPerProduk,
      },
      biayaOperasional: {
        total: totalOperasional,
        count: operasionals.length,
      },
      totalHpp,
      labaKotor,
      labaBersih,
      margin: totalRevenue > 0 ? ((labaBersih / totalRevenue) * 100).toFixed(2) : '0.00',
    }
  }

  /**
   * Get HPP by product
   */
  async getHppByProduct(productId: number, startDate?: DateTime, endDate?: DateTime) {
    const dateFilter = this.buildDateFilter(startDate, endDate)

    let query = Transaksi.query().where('status', 'success').where('product_id', productId)

    if (dateFilter) {
      query = query.whereRaw(dateFilter)
    }

    const transactions = await query.preload('productRelation')
    const product = await Produk.findOrFail(productId)

    const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0)
    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total), 0)
    const hargaBeli = product.hargaBeli || 0
    const totalHpp = hargaBeli * totalQuantity
    const laba = totalRevenue - totalHpp

    return {
      product: {
        id: product.id,
        name: product.name,
        hargaBeli,
        hargaJual: product.price,
      },
      periode: {
        startDate: startDate?.toISODate() || null,
        endDate: endDate?.toISODate() || null,
      },
      totalQuantity,
      totalRevenue,
      totalHpp,
      laba,
      margin: totalRevenue > 0 ? ((laba / totalRevenue) * 100).toFixed(2) : '0.00',
      transactions: transactions.map((t) => ({
        id: t.id,
        quantity: t.quantity,
        total: t.total,
        date: t.createdAt.toISODate(),
      })),
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
