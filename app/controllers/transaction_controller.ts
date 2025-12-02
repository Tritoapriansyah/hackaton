import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { TransactionService } from '#services/transaction_service'
import { DateTime } from 'luxon'

@inject()
export default class TransactionController {
  constructor(protected transactionService: TransactionService) {}

  /**
   * Get my transactions
   */
  async myTransactions({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const limit = request.input('limit', 50)

    const transactions = await this.transactionService.getUserTransactions(user.id, limit)
    return response.ok(transactions)
  }

  /**
   * Get transaction by transaction ID
   */
  async show({ params, auth, response }: HttpContext) {
    const transaction = await this.transactionService.getByTransactionId(params.transactionId)

    if (!transaction) {
      return response.notFound({ message: 'Transaction not found' })
    }

    // Only allow users to view their own transactions, or admins to view all
    if (!auth.user!.isAdmin && transaction.userId !== auth.user!.id) {
      return response.forbidden({ message: 'You can only view your own transactions' })
    }

    return response.ok(transaction)
  }

  /**
   * Get transaction statistics (admin only)
   */
  async statistics({ auth, request, response }: HttpContext) {
    if (!auth.user!.isAdmin) {
      return response.forbidden({ message: 'Admin access required' })
    }

    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined

    const stats = await this.transactionService.getStatistics(startDate, endDate)
    return response.ok(stats)
  }

  /**
   * Get transactions by status (admin only)
   */
  async byStatus({ auth, params, request, response }: HttpContext) {
    if (!auth.user!.isAdmin) {
      return response.forbidden({ message: 'Admin access required' })
    }

    const limit = request.input('limit', 50)
    const transactions = await this.transactionService.getByStatus(params.status, limit)

    return response.ok(transactions)
  }

  /**
   * Get payment method distribution (admin only)
   */
  async methodDistribution({ auth, response }: HttpContext) {
    if (!auth.user!.isAdmin) {
      return response.forbidden({ message: 'Admin access required' })
    }

    const distribution = await this.transactionService.getPaymentMethodDistribution()
    return response.ok(distribution)
  }
}
