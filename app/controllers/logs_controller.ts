import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { LogService } from '#services/log_service'

@inject()
export default class LogsController {
  constructor(protected logService: LogService) {}

  /**
   * Get all logs with filtering and pagination
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const filters = {
      type: request.input('type'),
      action: request.input('action'),
      productId: request.input('product_id'),
      userId: request.input('user_id'),
      startDate: request.input('start_date'),
      endDate: request.input('end_date'),
    }

    const logs = await this.logService.getLogs(page, limit, filters)
    return response.ok(logs)
  }

  /**
   * Get logs for a specific product
   */
  async productLogs({ params, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const logs = await this.logService.getProductLogs(params.id, page, limit)
    return response.ok(logs)
  }

  /**
   * Get stock history for a specific product
   */
  async stockHistory({ params, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const logs = await this.logService.getStockHistory(params.id, page, limit)
    return response.ok(logs)
  }

  /**
   * Get recent logs
   */
  async recent({ request, response }: HttpContext) {
    const limit = request.input('limit', 10)

    const logs = await this.logService.getRecentLogs(limit)
    return response.ok(logs)
  }

  /**
   * Clean up old logs
   */
  async cleanup({ request, response }: HttpContext) {
    const days = request.input('days', 90)

    const deleted = await this.logService.deleteOldLogs(days)
    return response.ok({
      message: `Successfully deleted ${deleted} old logs`,
      deleted,
    })
  }
}
