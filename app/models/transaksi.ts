import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Transaksi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
