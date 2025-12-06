import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_free').defaultTo(false).after('view_limit')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_free')
    })
  }
}
