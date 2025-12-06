import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Course from '#models/course'

export default class extends BaseSeeder {
  public async run() {
    // Create demo courses if none exist
    const count = await Course.query().count('* as total').first()
    const total = Number(count?.$extras?.total ?? 0)
    if (total > 0) {
      console.log('Courses already seeded')
      return
    }

    const demoCourses = [
      {
        title: 'ACCA: Foundations of Accounting',
        slug: 'acca-foundations-of-accounting',
        description: 'Introductory course covering basics of accounting for ACCA students.',
        thumbnail: null,
        isPublished: true,
        price: 2500.0,
        currency: 'INR',
        isFree: false,
      },
      {
        title: 'ACCA: Advanced Financial Reporting',
        slug: 'acca-advanced-financial-reporting',
        description: 'Advanced topics for financial reporting and analysis.',
        thumbnail: null,
        isPublished: true,
        price: 5000.0,
        currency: 'INR',
        isFree: false,
      },
      {
        title: 'ACCA: Free Sample Course',
        slug: 'acca-free-sample-course',
        description: 'A free sample to try the platform.',
        thumbnail: null,
        isPublished: true,
        price: null,
        currency: 'INR',
        isFree: true,
      },
    ]

    for (const c of demoCourses) {
      await Course.create(c)
    }

    console.log('Demo courses seeded')
  }
}
