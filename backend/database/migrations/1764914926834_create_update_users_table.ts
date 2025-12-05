import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone', 20).nullable().unique().after('email')
      table.enum('role', ['student', 'admin']).defaultTo('student').after('password')
      table.string('session_token', 255).nullable().after('role')
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
