import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('harga_beli', 15, 2).defaultTo(0).after('price')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('harga_beli')
    })
  }
}
