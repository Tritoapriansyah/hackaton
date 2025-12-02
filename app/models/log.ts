import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Produk from './produk.js'
import User from './user.js'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare message: string

  @column()
  declare type: 'info' | 'error' | 'warning' | 'success'

  @column()
  declare action: string | null

  @column()
  declare productId: number | null

  @column()
  declare userId: number | null

  @column()
  declare oldStock: number | null

  @column()
  declare newStock: number | null

  @column()
  declare metadata: string | null

  @belongsTo(() => Produk)
  declare product: BelongsTo<typeof Produk>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
