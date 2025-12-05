import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table
        .integer('enrolled_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()
      table.timestamp('enrolled_at')
      table.unique(['user_id', 'course_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
