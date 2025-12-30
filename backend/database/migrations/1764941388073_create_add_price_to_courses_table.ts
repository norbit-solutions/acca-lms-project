import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Price is for display only - payments are handled manually via WhatsApp
      table.decimal('price', 10, 2).nullable()
      table.string('currency', 10).defaultTo('INR')
      table.boolean('is_free').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price')
      table.dropColumn('currency')
      table.dropColumn('is_free')
    })
  }
}
