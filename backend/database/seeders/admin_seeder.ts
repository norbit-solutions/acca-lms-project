import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Check if admin already exists
    const existingAdmin = await User.findBy('email', 'admin@acca-lms.com')
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user (password will be auto-hashed by the AuthFinder mixin)
    await User.create({
      fullName: 'Admin User',
      email: 'admin@acca-lms.com',
      phone: '+1234567890',
      password: 'admin123',
      role: 'admin',
    })

    console.log('Admin user created:')
    console.log('  Email: admin@acca-lms.com')
    console.log('  Password: admin123')
  }
}
