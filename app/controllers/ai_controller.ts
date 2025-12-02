/*
|--------------------------------------------------------------------------
| AI Controller
|--------------------------------------------------------------------------
|
| Controller untuk AI/ML endpoints:
| - Sales prediction
| - Product recommendations
| - Trend analysis
|
*/

import type { HttpContext } from '@adonisjs/core/http'
import { AIService } from '#services/ai_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AIController {
  constructor(private aiService: AIService) {}

  /**
   * Predict sales untuk periode berikutnya
   * GET /api/ai/predict-sales
   */
  async predictSales({ request, response }: HttpContext) {
    try {
      const days = request.input('days', 30)
      const productId = request.input('productId')

      const predictions = await this.aiService.predictSales(days, productId)

      return response.ok({
        success: true,
        data: predictions,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to generate sales predictions',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Get product recommendations
   * GET /api/ai/recommendations
   */
  async recommendations({ request, response }: HttpContext) {
    try {
      const userId = request.input('userId')
      const limit = request.input('limit', 5)

      const recommendations = await this.aiService.recommendProducts(userId, limit)

      return response.ok({
        success: true,
        data: recommendations.map((rec) => ({
          product: {
            id: rec.product.id,
            name: rec.product.name,
            price: rec.product.price,
            stock: rec.product.stock,
            description: rec.product.description,
          },
          score: rec.score,
          reason: rec.reason,
        })),
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to generate recommendations',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Analyze sales trends
   * GET /api/ai/trends
   */
  async trends({ request, response }: HttpContext) {
    try {
      const period = request.input('period', 'month') as 'week' | 'month' | 'year'

      const trends = await this.aiService.analyzeTrends(period)

      return response.ok({
        success: true,
        data: trends,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Failed to analyze trends',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
