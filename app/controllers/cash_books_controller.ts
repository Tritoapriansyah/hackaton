import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CashBookService } from '#services/cash_book_service'
import { cashBookValidator, updateCashBookValidator } from '#validators/cash_book'
import { DateTime } from 'luxon'

@inject()
export default class CashBooksController {
  constructor(protected cashBookService: CashBookService) {}

  /**
   * Create a new cash book entry (User only)
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const payload = await request.validateUsing(cashBookValidator)

    try {
      const cashBook = await this.cashBookService.create(user.id, payload)

      return response.created({
        message: 'Cash book entry created successfully',
        data: cashBook,
      })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to create cash book entry',
        error: error.message,
      })
    }
  }

  /**
   * Get user's cash book entries (User can see their own, Admin can see all)
   */
  async index({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const type = request.input('type') as 'masuk' | 'keluar' | undefined
    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined
    const category = request.input('category')

    try {
      let result

      if (user.isAdmin) {
        // Admin can see all cash books
        result = await this.cashBookService.getAllCashBooks(page, limit, {
          userId: request.input('user_id'),
          type,
          startDate,
          endDate,
          category,
        })
      } else {
        // User can only see their own cash books
        result = await this.cashBookService.getUserCashBooks(user.id, page, limit, {
          type,
          startDate,
          endDate,
          category,
        })
      }

      return response.ok(result)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to fetch cash book entries',
        error: error.message,
      })
    }
  }

  /**
   * Get cash book entry by ID
   */
  async show({ params, auth, response }: HttpContext) {
    const user = auth.user!

    try {
      const cashBook = await this.cashBookService.getById(
        params.id,
        user.isAdmin ? undefined : user.id
      )

      // Check if user owns this entry or is admin
      if (!user.isAdmin && cashBook.userId !== user.id) {
        return response.forbidden({ message: 'Unauthorized to view this cash book entry' })
      }

      return response.ok({ data: cashBook })
    } catch (error: any) {
      return response.notFound({
        message: 'Cash book entry not found',
        error: error.message,
      })
    }
  }

  /**
   * Update cash book entry (User can update their own, Admin can update any)
   */
  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(updateCashBookValidator)

    try {
      const cashBook = await this.cashBookService.update(params.id, user.id, payload, user.isAdmin)

      return response.ok({
        message: 'Cash book entry updated successfully',
        data: cashBook,
      })
    } catch (error: any) {
      if (error.status === 403) {
        return response.forbidden({
          message: error.message,
        })
      }

      return response.unprocessableEntity({
        message: 'Failed to update cash book entry',
        error: error.message,
      })
    }
  }

  /**
   * Delete cash book entry (User can delete their own, Admin can delete any)
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!

    try {
      await this.cashBookService.delete(params.id, user.id, user.isAdmin)

      return response.ok({
        message: 'Cash book entry deleted successfully',
      })
    } catch (error: any) {
      if (error.status === 403) {
        return response.forbidden({
          message: error.message,
        })
      }

      return response.unprocessableEntity({
        message: 'Failed to delete cash book entry',
        error: error.message,
      })
    }
  }

  /**
   * Get cash book statistics (User can see their own, Admin can see all)
   */
  async statistics({ request, auth, response }: HttpContext) {
    const user = auth.user!

    try {
      const userId = user.isAdmin ? request.input('user_id', user.id) : user.id
      const statistics = await this.cashBookService.getUserStatistics(userId)

      return response.ok({ data: statistics })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to get cash book statistics',
        error: error.message,
      })
    }
  }
}
