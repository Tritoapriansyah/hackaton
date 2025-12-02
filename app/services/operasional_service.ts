import Operasional from '#models/operasional'
import type { Infer } from '@vinejs/vine/types'
import { operasionalValidator, updateOperasionalValidator } from '#validators/operasional'

export class OperasionalService {
  /**
   * Create a new operasional entry
   */
  async create(data: Infer<typeof operasionalValidator>): Promise<Operasional> {
    const operasional = await Operasional.create({
      name: data.name,
      price: data.price,
      description: data.description || null,
      priode: data.priode,
    })

    return operasional
  }

  /**
   * Get all operasional entries
   */
  async getAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      priode?: 'monthly' | 'annual'
      search?: string
    }
  ): Promise<{ data: Operasional[]; meta: any }> {
    const query = Operasional.query().orderBy('created_at', 'desc')

    if (filters?.priode) {
      query.where('priode', filters.priode)
    }

    if (filters?.search) {
      query.where((q) => {
        q.whereILike('name', `%${filters.search}%`).orWhereILike(
          'description',
          `%${filters.search}%`
        )
      })
    }

    const operasionals = await query.paginate(page, limit)

    return {
      data: operasionals.all(),
      meta: operasionals.serialize().meta,
    }
  }

  /**
   * Get operasional by ID
   */
  async getById(id: number): Promise<Operasional> {
    const operasional = await Operasional.findOrFail(id)
    return operasional
  }

  /**
   * Update operasional entry
   */
  async update(id: number, data: Infer<typeof updateOperasionalValidator>): Promise<Operasional> {
    const operasional = await Operasional.findOrFail(id)

    if (data.name) operasional.name = data.name
    if (data.price) operasional.price = data.price
    if (data.description !== undefined) operasional.description = data.description
    if (data.priode) operasional.priode = data.priode

    await operasional.save()

    return operasional
  }

  /**
   * Delete operasional entry
   */
  async delete(id: number): Promise<void> {
    const operasional = await Operasional.findOrFail(id)
    await operasional.delete()
  }

  /**
   * Get operasional statistics
   */
  async getStatistics(): Promise<{
    totalMonthly: number
    totalAnnual: number
    totalCost: number
    count: number
  }> {
    const operasionals = await Operasional.query()

    const monthly = operasionals.filter((o) => o.priode === 'monthly')
    const annual = operasionals.filter((o) => o.priode === 'annual')

    const totalMonthly = monthly.reduce((sum, o) => sum + Number(o.price), 0)
    const totalAnnual = annual.reduce((sum, o) => sum + Number(o.price), 0)
    const totalCost = operasionals.reduce((sum, o) => sum + Number(o.price), 0)

    return {
      totalMonthly,
      totalAnnual,
      totalCost,
      count: operasionals.length,
    }
  }
}
