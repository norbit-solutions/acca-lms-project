import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Sample course data (will come from API later)
const courses = [
  { id: 1, slug: 'fa-financial-accounting', title: 'FA - Financial Accounting', description: 'Foundation level financial accounting course', lessons: 24 },
  { id: 2, slug: 'ma-management-accounting', title: 'MA - Management Accounting', description: 'Foundation level management accounting', lessons: 20 },
  { id: 3, slug: 'fr-financial-reporting', title: 'FR - Financial Reporting', description: 'Skills level financial reporting course', lessons: 32 },
]

const features = [
  { title: 'HD Video Lessons', description: 'Crystal clear video content from experienced ACCA instructors', icon: '🎬' },
  { title: 'Secure Platform', description: 'Protected content with anti-piracy measures', icon: '🔒' },
  { title: 'Learn at Your Pace', description: 'Access lessons anytime, anywhere on any device', icon: '⏰' },
  { title: 'Expert Instructors', description: 'Learn from qualified ACCA professionals', icon: '👨‍🏫' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Master ACCA with Expert-Led Video Courses
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students preparing for their ACCA exams with our comprehensive video lessons and study materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Browse Courses
              </Link>
              <Link 
                href="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50" id="courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <p className="text-gray-600">Comprehensive ACCA courses designed for success</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{course.lessons} lessons</span>
                    <Link 
                      href={`/courses/${course.slug}`}
                      className="text-blue-600 font-medium hover:text-blue-700"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600">Everything you need to succeed in your ACCA journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Register today and request enrollment to start your ACCA journey with us.
          </p>
          <Link 
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
