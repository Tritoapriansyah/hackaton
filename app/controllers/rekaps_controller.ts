import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { RekapService } from '#services/rekap_service'
import { DateTime } from 'luxon'

@inject()
export default class RekapsController {
  constructor(protected rekapService: RekapService) {}

  /**
   * Get comprehensive rekap report
   */
  async index({ request, response }: HttpContext) {
    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined

    try {
      const rekap = await this.rekapService.getRekap(startDate, endDate)
      return response.ok(rekap)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to generate rekap',
        error: error.message,
      })
    }
  }

  /**
   * Get rekap penjualan only
   */
  async penjualan({ request, response }: HttpContext) {
    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined

    try {
      let dateFilter: string | undefined
      if (startDate && endDate) {
        dateFilter = `created_at >= '${startDate.toSQL()}' AND created_at <= '${endDate.toSQL()}'`
      } else if (startDate) {
        dateFilter = `created_at >= '${startDate.toSQL()}'`
      } else if (endDate) {
        dateFilter = `created_at <= '${endDate.toSQL()}'`
      }
      const rekap = await this.rekapService.getRekapPenjualan(dateFilter)
      return response.ok(rekap)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to generate rekap penjualan',
        error: error.message,
      })
    }
  }

  /**
   * Get rekap produk only
   */
  async produk({ response }: HttpContext) {
    try {
      const rekap = await this.rekapService.getRekapProduk()
      return response.ok(rekap)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to generate rekap produk',
        error: error.message,
      })
    }
  }

  /**
   * Get rekap operasional only
   */
  async operasional({ response }: HttpContext) {
    try {
      const rekap = await this.rekapService.getRekapOperasional()
      return response.ok(rekap)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to generate rekap operasional',
        error: error.message,
      })
    }
  }

  /**
   * Get rekap keuangan only
   */
  async keuangan({ request, response }: HttpContext) {
    const startDate = request.input('start_date')
      ? DateTime.fromISO(request.input('start_date'))
      : undefined
    const endDate = request.input('end_date')
      ? DateTime.fromISO(request.input('end_date'))
      : undefined

    try {
      let dateFilter: string | undefined
      if (startDate && endDate) {
        dateFilter = `created_at >= '${startDate.toSQL()}' AND created_at <= '${endDate.toSQL()}'`
      } else if (startDate) {
        dateFilter = `created_at >= '${startDate.toSQL()}'`
      } else if (endDate) {
        dateFilter = `created_at <= '${endDate.toSQL()}'`
      }
      const rekap = await this.rekapService.getRekapKeuangan(dateFilter)
      return response.ok(rekap)
    } catch (error: any) {
      return response.unprocessableEntity({
        message: 'Failed to generate rekap keuangan',
        error: error.message,
      })
    }
  }
}
