import Transaksi from '#models/transaksi'
import type { PaymentMethod } from '#models/transaksi'
import { DateTime } from 'luxon'

export type PaymentStatus = 'pending' | 'success' | 'failed'

export interface CreateTransactionData {
  userId: number
  productId: number
  product: string
  name: string
  quantity: number
  total: number
  paymentMethod?: PaymentMethod
  paymentGateway?: string
  transactionId?: string
  ipAddress?: string
  notes?: string
}

export class TransactionService {
  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionData): Promise<Transaksi> {
    return Transaksi.create({
      userId: data.userId,
      productId: data.productId,
      product: data.product,
      name: data.name,
      quantity: data.quantity,
      total: data.total,
      status: 'pending',
      paymentMethod: data.paymentMethod || null,
      paymentGateway: data.paymentGateway || null,
      transactionId: data.transactionId || null,
      ipAddress: data.ipAddress || null,
      notes: data.notes || null,
    })
  }

  /**
   * Update transaction status
   */
  async updateStatus(id: number, status: PaymentStatus, notes?: string): Promise<Transaksi> {
    const transaction = await Transaksi.findOrFail(id)
    transaction.status = status

    if (notes) {
      transaction.notes = notes
    }

    if (status === 'success') {
      transaction.paidAt = DateTime.now()
    }

    await transaction.save()
    return transaction
  }

  /**
   * Get transaction by transaction ID
   */
  async getByTransactionId(transactionId: string): Promise<Transaksi | null> {
    return Transaksi.query()
      .where('transaction_id', transactionId)
      .preload('user')
      .preload('productRelation')
      .first()
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(userId: number, limit: number = 50): Promise<Transaksi[]> {
    return Transaksi.query()
      .where('user_id', userId)
      .preload('productRelation')
      .orderBy('created_at', 'desc')
      .limit(limit)
  }

  /**
   * Get transaction statistics
   */
  async getStatistics(startDate?: DateTime, endDate?: DateTime) {
    const query = Transaksi.query()

    if (startDate) {
      const sqlDate = startDate.toSQL()
      if (sqlDate) query.where('created_at', '>=', sqlDate)
    }
    if (endDate) {
      const sqlDate = endDate.toSQL()
      if (sqlDate) query.where('created_at', '<=', sqlDate)
    }

    const [total, success, failed, amount] = await Promise.all([
      query.clone().count('* as total'),
      query.clone().where('status', 'success').count('* as total'),
      query.clone().where('status', 'failed').count('* as total'),
      query.clone().where('status', 'success').sum('total as amount'),
    ])

    return {
      totalTransactions: Number(total[0].$extras.total),
      successTransactions: Number(success[0].$extras.total),
      failedTransactions: Number(failed[0].$extras.total),
      totalAmount: Number(amount[0].$extras.amount || 0),
      successRate:
        Number(total[0].$extras.total) > 0
          ? (Number(success[0].$extras.total) / Number(total[0].$extras.total)) * 100
          : 0,
    }
  }

  /**
   * Get transactions by status
   */
  async getByStatus(status: PaymentStatus, limit: number = 50): Promise<Transaksi[]> {
    return Transaksi.query()
      .where('status', status)
      .preload('user')
      .preload('productRelation')
      .orderBy('created_at', 'desc')
      .limit(limit)
  }

  /**
   * Get payment method distribution
   */
  async getPaymentMethodDistribution() {
    const distribution = await Transaksi.query()
      .select('payment_method')
      .count('* as total')
      .sum('total as total_amount')
      .where('status', 'success')
      .whereNotNull('payment_method')
      .groupBy('payment_method')

    return distribution.map((row) => ({
      method: row.paymentMethod,
      count: Number(row.$extras.total),
      totalAmount: Number(row.$extras.total_amount),
    }))
  }
}
