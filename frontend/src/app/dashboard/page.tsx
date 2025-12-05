'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import Navbar from '@/components/Navbar'

// Sample enrolled courses (will come from API later)
const enrolledCourses = [
  { 
    id: 1, 
    slug: 'fa-financial-accounting', 
    title: 'FA - Financial Accounting', 
    progress: 45,
    totalLessons: 24,
    completedLessons: 11
  },
]

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your learning journey where you left off.
          </p>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link 
                      href={`/dashboard/courses/${course.slug}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="font-bold text-lg mb-2">No Courses Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't been enrolled in any courses yet. Contact us via WhatsApp to request enrollment.
              </p>
              <a 
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Contact via WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Browse More Courses */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Looking for more courses?</h3>
          <p className="text-gray-600 mb-4">
            Browse our catalog and request enrollment for courses you're interested in.
          </p>
          <Link 
            href="/courses"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
