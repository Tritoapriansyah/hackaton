import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('action').nullable()
      table
        .integer('product_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('produks')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.integer('old_stock').nullable()
      table.integer('new_stock').nullable()
      table.text('metadata').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('action')
      table.dropColumn('product_id')
      table.dropColumn('user_id')
      table.dropColumn('old_stock')
      table.dropColumn('new_stock')
      table.dropColumn('metadata')
    })
  }
}
