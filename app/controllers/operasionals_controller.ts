import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { OperasionalService } from '#services/operasional_service'
import { operasionalValidator, updateOperasionalValidator } from '#validators/operasional'

@inject()
export default class OperasionalsController {
  constructor(protected operasionalService: OperasionalService) {}

  /**
   * Create a new operasional entry (Admin only)
   */
  async store({ request, auth, response }: HttpContext) {
    if (!auth.user!.isAdmin) {
      return response.forbidden({ message: 'Admin access required' })
    }

    const payload = await request.validateUsing(operasionalValidator)

    try {
      const operasional = await this.operasionalService.create(payload)

      return response.created({
        message: 'Operasional created successfully',
        data: operasional,
      })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to create operasional',
        error: error.message,
      })
    }
  }

  /**
   * Get all operasional entries
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const priode = request.input('priode') as 'monthly' | 'annual' | undefined
    const search = request.input('search')

    try {
      const result = await this.operasionalService.getAll(page, limit, {
        priode,
        search,
      })

      return response.ok(result)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to fetch operasional entries',
        error: error.message,
      })
    }
  }

  /**
   * Get operasional by ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const operasional = await this.operasionalService.getById(params.id)
      return response.ok({ data: operasional })
    } catch (error: any) {
      return response.notFound({
        message: 'Operasional not found',
        error: error.message,
      })
    }
  }

  /**
   * Update operasional entry (Admin only)
   */
  async update({ params, request, auth, response }: HttpContext) {
    if (!auth.user!.isAdmin) {
      return response.forbidden({ message: 'Admin access required' })
    }

    const payload = await request.validateUsing(updateOperasionalValidator)

    try {
      const operasional = await this.operasionalService.update(params.id, payload)

      return response.ok({
        message: 'Operasional updated successfully',
        data: operasional,
      })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to update operasional',
        error: error.message,
      })
    }
  }

  /**
   * Delete operasional entry (Admin only)
   */
  async destroy({ params, auth, response }: HttpContext) {
    if (!auth.user!.isAdmin) {
      return response.forbidden({ message: 'Admin access required' })
    }

    try {
      await this.operasionalService.delete(params.id)

      return response.ok({
        message: 'Operasional deleted successfully',
      })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to delete operasional',
        error: error.message,
      })
    }
  }

  /**
   * Get operasional statistics
   */
  async statistics({ response }: HttpContext) {
    try {
      const statistics = await this.operasionalService.getStatistics()
      return response.ok({ data: statistics })
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to get operasional statistics',
        error: error.message,
      })
    }
  }
}
