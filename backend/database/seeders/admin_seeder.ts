import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Check if admin already exists
    const existingAdmin = await User.findBy('email', 'norbitsolutions@gmail.com')
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user (password will be auto-hashed by the AuthFinder mixin)
    await User.create({
      fullName: 'Norbit Slutions',
      email: 'norbitsolutions@gmail.com',
      phone: '+916282417804',
      password: 'Muft1Menk',
      role: 'admin',
    })

    console.log('Admin user created:')
    console.log(' Email: norbitsolutions@gmail.com')
    console.log(' Password: Muft1Menk')
  }
}
