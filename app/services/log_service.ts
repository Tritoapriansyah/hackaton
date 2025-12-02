import Log from '#models/log'
import Produk from '#models/produk'

export class LogService {
  /**
   * Create a stock edit log
   */
  async logStockEdit(
    productId: number,
    userId: number | null,
    oldStock: number,
    newStock: number,
    metadata?: Record<string, any>
  ) {
    const product = await Produk.find(productId)
    const stockDiff = newStock - oldStock
    const action = stockDiff > 0 ? 'stock_increase' : 'stock_decrease'

    const message = product
      ? `Stock ${action.replace('_', ' ')} for "${product.name}" from ${oldStock} to ${newStock} (${stockDiff > 0 ? '+' : ''}${stockDiff})`
      : `Stock ${action.replace('_', ' ')} from ${oldStock} to ${newStock} (${stockDiff > 0 ? '+' : ''}${stockDiff})`

    return Log.create({
      message,
      type: 'info',
      action,
      productId,
      userId,
      oldStock,
      newStock,
      metadata: metadata ? JSON.stringify(metadata) : null,
    })
  }

  /**
   * Create a generic log entry
   */
  async createLog(
    message: string,
    type: 'info' | 'error' | 'warning' | 'success',
    action?: string,
    userId?: number,
    metadata?: Record<string, any>
  ) {
    return Log.create({
      message,
      type,
      action: action || null,
      userId: userId || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    })
  }

  /**
   * Get all logs with pagination and filtering
   */
  async getLogs(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: 'info' | 'error' | 'warning' | 'success'
      action?: string
      productId?: number
      userId?: number
      startDate?: string
      endDate?: string
    }
  ) {
    const query = Log.query().preload('product').preload('user').orderBy('created_at', 'desc')

    if (filters?.type) {
      query.where('type', filters.type)
    }

    if (filters?.action) {
      query.where('action', filters.action)
    }

    if (filters?.productId) {
      query.where('product_id', filters.productId)
    }

    if (filters?.userId) {
      query.where('user_id', filters.userId)
    }

    if (filters?.startDate) {
      query.where('created_at', '>=', filters.startDate)
    }

    if (filters?.endDate) {
      query.where('created_at', '<=', filters.endDate)
    }

    return query.paginate(page, limit)
  }

  /**
   * Get logs for a specific product
   */
  async getProductLogs(productId: number, page: number = 1, limit: number = 20) {
    return Log.query()
      .where('product_id', productId)
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get stock edit history for a product
   */
  async getStockHistory(productId: number, page: number = 1, limit: number = 20) {
    return Log.query()
      .where('product_id', productId)
      .whereIn('action', ['stock_increase', 'stock_decrease'])
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
  }

  /**
   * Get recent logs
   */
  async getRecentLogs(limit: number = 10) {
    return Log.query().preload('product').preload('user').orderBy('created_at', 'desc').limit(limit)
  }

  /**
   * Delete old logs (cleanup)
   */
  async deleteOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const deleted = await Log.query().where('created_at', '<', cutoffDate.toISOString()).delete()

    return deleted
  }
}
