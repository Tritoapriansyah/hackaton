import CashBook from '#models/cash_book'
import { Exception } from '@adonisjs/core/exceptions'
import type { Infer } from '@vinejs/vine/types'
import { cashBookValidator, updateCashBookValidator } from '#validators/cash_book'
import { DateTime } from 'luxon'

export class CashBookService {
  /**
   * Create a new cash book entry
   */
  async create(userId: number, data: Infer<typeof cashBookValidator>): Promise<CashBook> {
    // Convert Date to DateTime if needed
    const transactionDate =
      data.transactionDate instanceof DateTime
        ? data.transactionDate
        : DateTime.fromJSDate(data.transactionDate)

    const cashBook = await CashBook.create({
      userId,
      type: data.type,
      amount: data.amount,
      description: data.description || null,
      category: data.category || null,
      referenceNumber: data.referenceNumber || null,
      transactionDate,
    })

    return cashBook
  }

  /**
   * Get all cash book entries for a user
   */
  async getUserCashBooks(
    userId: number,
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: 'masuk' | 'keluar'
      startDate?: DateTime
      endDate?: DateTime
      category?: string
    }
  ): Promise<{ data: CashBook[]; meta: any }> {
    const query = CashBook.query()
      .where('user_id', userId)
      .preload('user')
      .orderBy('transaction_date', 'desc')
      .orderBy('created_at', 'desc')

    if (filters?.type) {
      query.where('type', filters.type)
    }

    if (filters?.startDate) {
      const startDateStr = filters.startDate.toISODate()
      if (startDateStr) {
        query.where('transaction_date', '>=', startDateStr)
      }
    }

    if (filters?.endDate) {
      const endDateStr = filters.endDate.toISODate()
      if (endDateStr) {
        query.where('transaction_date', '<=', endDateStr)
      }
    }

    if (filters?.category) {
      query.where('category', filters.category)
    }

    const cashBooks = await query.paginate(page, limit)

    return {
      data: cashBooks.all(),
      meta: cashBooks.serialize().meta,
    }
  }

  /**
   * Get all cash book entries (admin only)
   */
  async getAllCashBooks(
    page: number = 1,
    limit: number = 20,
    filters?: {
      userId?: number
      type?: 'masuk' | 'keluar'
      startDate?: DateTime
      endDate?: DateTime
      category?: string
    }
  ): Promise<{ data: CashBook[]; meta: any }> {
    const query = CashBook.query()
      .preload('user')
      .orderBy('transaction_date', 'desc')
      .orderBy('created_at', 'desc')

    if (filters?.userId) {
      query.where('user_id', filters.userId)
    }

    if (filters?.type) {
      query.where('type', filters.type)
    }

    if (filters?.startDate) {
      const startDateStr = filters.startDate.toISODate()
      if (startDateStr) {
        query.where('transaction_date', '>=', startDateStr)
      }
    }

    if (filters?.endDate) {
      const endDateStr = filters.endDate.toISODate()
      if (endDateStr) {
        query.where('transaction_date', '<=', endDateStr)
      }
    }

    if (filters?.category) {
      query.where('category', filters.category)
    }

    const cashBooks = await query.paginate(page, limit)

    return {
      data: cashBooks.all(),
      meta: cashBooks.serialize().meta,
    }
  }

  /**
   * Get cash book entry by ID
   */
  async getById(id: number, userId?: number): Promise<CashBook> {
    const query = CashBook.query().preload('user')

    if (userId) {
      query.where('user_id', userId)
    }

    const cashBook = await query.where('id', id).firstOrFail()

    return cashBook
  }

  /**
   * Update cash book entry
   */
  async update(
    id: number,
    userId: number,
    data: Infer<typeof updateCashBookValidator>,
    isAdmin: boolean = false
  ): Promise<CashBook> {
    const cashBook = await CashBook.findOrFail(id)

    // Check if user owns this entry or is admin
    if (!isAdmin && cashBook.userId !== userId) {
      throw new Exception('Unauthorized to update this cash book entry.', { status: 403 })
    }

    if (data.type) cashBook.type = data.type
    if (data.amount) cashBook.amount = data.amount
    if (data.description !== undefined) cashBook.description = data.description
    if (data.category !== undefined) cashBook.category = data.category
    if (data.referenceNumber !== undefined) cashBook.referenceNumber = data.referenceNumber
    if (data.transactionDate) {
      cashBook.transactionDate =
        data.transactionDate instanceof DateTime
          ? data.transactionDate
          : DateTime.fromJSDate(data.transactionDate)
    }

    await cashBook.save()

    return cashBook
  }

  /**
   * Delete cash book entry
   */
  async delete(id: number, userId: number, isAdmin: boolean = false): Promise<void> {
    const cashBook = await CashBook.findOrFail(id)

    // Check if user owns this entry or is admin
    if (!isAdmin && cashBook.userId !== userId) {
      throw new Exception('Unauthorized to delete this cash book entry.', { status: 403 })
    }

    await cashBook.delete()
  }

  /**
   * Get cash book statistics for a user
   */
  async getUserStatistics(userId: number): Promise<{
    totalMasuk: number
    totalKeluar: number
    balance: number
    totalEntries: number
  }> {
    const cashBooks = await CashBook.query().where('user_id', userId)

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
}
