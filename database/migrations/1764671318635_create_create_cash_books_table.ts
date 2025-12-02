import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cash_books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enum('type', ['masuk', 'keluar']).notNullable() // masuk = pemasukan, keluar = pengeluaran
      table.decimal('amount', 15, 2).notNullable() // jumlah uang
      table.string('description').nullable() // keterangan
      table.string('category').nullable() // kategori (opsional)
      table.string('reference_number').nullable() // nomor referensi (opsional)
      table.date('transaction_date').notNullable() // tanggal transaksi
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
