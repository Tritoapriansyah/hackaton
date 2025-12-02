import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Product from '#models/produk'

export type PaymentMethod =
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'e_wallet'
  | 'qris'

export default class Transaksi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare productId: number

  @column()
  declare product: string

  @column()
  declare name: string

  @column()
  declare quantity: number

  @column()
  declare total: number

  @column()
  declare status: 'pending' | 'success' | 'failed'

  @column()
  declare paymentMethod: PaymentMethod | null

  @column()
  declare paymentGateway: string | null

  @column()
  declare transactionId: string | null

  @column()
  declare ipAddress: string | null

  @column()
  declare notes: string | null

  @column.dateTime()
  declare paidAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Product, {
    foreignKey: 'productId',
  })
  declare productRelation: BelongsTo<typeof Product>
}
