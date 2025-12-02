import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HppService } from '#services/hpp_service'
import { DateTime } from 'luxon'

@inject()
export default class HppsController {
  constructor(protected hppService: HppService) {}

  /**
   * Calculate HPP for a period
   */
  async calculate({ request, response }: HttpContext) {
    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined

    try {
      const hpp = await this.hppService.calculateHpp(startDate, endDate)
      return response.ok(hpp)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to calculate HPP',
        error: error.message,
      })
    }
  }

  /**
   * Get HPP by product
   */
  async byProduct({ params, request, response }: HttpContext) {
    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined

    try {
      const hpp = await this.hppService.getHppByProduct(params.productId, startDate, endDate)
      return response.ok(hpp)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to calculate HPP for product',
        error: error.message,
      })
    }
  }
}
