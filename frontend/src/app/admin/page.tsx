'use client'

import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api'

interface Stats {
  totalCourses: number
  totalStudents: number
  totalEnrollments: number
  recentEnrollments: Array<{
    id: number
    user: { fullName: string; email: string }
    course: { title: string }
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { data } = await adminApi.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Set default stats if API not ready
      setStats({
        totalCourses: 0,
        totalStudents: 0,
        totalEnrollments: 0,
        recentEnrollments: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">👤</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEnrollments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Enrollments</h2>
        </div>
        <div className="p-6">
          {stats?.recentEnrollments && stats.recentEnrollments.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{enrollment.user.fullName}</p>
                      <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                    </td>
                    <td className="py-3 text-gray-900">{enrollment.course.title}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(enrollment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-8">No enrollments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
