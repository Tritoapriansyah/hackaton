/*
|--------------------------------------------------------------------------
| Monitoring Controller
|--------------------------------------------------------------------------
|
| Controller untuk monitoring endpoints
|
*/

import type { HttpContext } from '@adonisjs/core/http'
import { MonitoringService } from '#services/monitoring_service'
import { inject } from '@adonisjs/core'

@inject()
export default class MonitoringController {
  constructor(private monitoringService: MonitoringService) {}

  /**
   * Get system health
   * GET /api/monitoring/health
   */
  async health({ response }: HttpContext) {
    try {
      const health = await this.monitoringService.getSystemHealth()

      return response.ok({
        success: true,
        data: health,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to get system health',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Get performance metrics
   * GET /api/monitoring/metrics
   */
  async metrics({ request, response }: HttpContext) {
    try {
      const endpoint = request.input('endpoint')
      const method = request.input('method')
      const startDate = request.input('startDate')
      const endDate = request.input('endDate')

      const filters: any = {}
      if (endpoint) filters.endpoint = endpoint
      if (method) filters.method = method
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate

      const metrics = this.monitoringService.getMetrics(filters)
      const averageResponseTime = this.monitoringService.getAverageResponseTime(endpoint)
      const errorRate = this.monitoringService.getErrorRate(endpoint)

      return response.ok({
        success: true,
        data: {
          metrics,
          averageResponseTime,
          errorRate,
          total: metrics.length,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to get metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Get top slow endpoints
   * GET /api/monitoring/slow-endpoints
   */
  async slowEndpoints({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 10)

      const slowEndpoints = this.monitoringService.getTopSlowEndpoints(limit)

      return response.ok({
        success: true,
        data: slowEndpoints,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to get slow endpoints',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
