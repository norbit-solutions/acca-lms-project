import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone', 20).nullable().unique()
      table.enum('role', ['student', 'admin']).defaultTo('student')
      table.string('session_token', 255).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('phone')
      table.dropColumn('role')
      table.dropColumn('session_token')
    })
  }
}
