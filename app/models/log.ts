import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare message: string

  @column()
  declare type: 'info' | 'error' | 'warning' | 'success'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
