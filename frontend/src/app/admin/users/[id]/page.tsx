'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api'

interface Enrollment {
  id: number
  course: { id: number; title: string }
  createdAt: string
}

interface VideoView {
  id: number
  viewCount: number
  lesson: {
    id: number
    title: string
    maxViews: number
    chapter: {
      course: { title: string }
    }
  }
  updatedAt: string
}

interface User {
  id: number
  fullName: string
  email: string
  phone: string
  role: string
  createdAt: string
  enrollments: Enrollment[]
  videoViews: VideoView[]
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.id)
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [userId])

  const loadUser = async () => {
    try {
      const { data } = await adminApi.getUser(userId)
      setUser(data)
    } catch (error) {
      console.error('Failed to load user:', error)
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveEnrollment = async (enrollment: Enrollment) => {
    if (!confirm(`Remove enrollment from ${enrollment.course.title}?`)) return
    try {
      await adminApi.deleteEnrollment(enrollment.id)
      loadUser()
    } catch (error) {
      console.error('Failed to remove enrollment:', error)
      alert('Failed to remove enrollment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/users')}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          ← Back to Users
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-500">{user.email}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{user.phone}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Enrollments ({user.enrollments.length})
            </h2>
          </div>
          {user.enrollments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {user.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{enrollment.course.title}</p>
                    <p className="text-sm text-gray-500">
                      Enrolled {new Date(enrollment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveEnrollment(enrollment)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No course enrollments
            </div>
          )}
        </div>

        {/* Video Views */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Video Views ({user.videoViews.length})
            </h2>
          </div>
          {user.videoViews.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {user.videoViews.map((view) => (
                <div key={view.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{view.lesson.title}</p>
                      <p className="text-sm text-gray-500">
                        {view.lesson.chapter.course.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          view.viewCount >= view.lesson.maxViews
                            ? 'text-red-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {view.viewCount} / {view.lesson.maxViews} views
                      </p>
                      <p className="text-sm text-gray-500">
                        Last: {new Date(view.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        view.viewCount >= view.lesson.maxViews
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          (view.viewCount / view.lesson.maxViews) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No video views recorded
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <dt className="text-sm text-gray-500">User ID</dt>
            <dd className="font-medium text-gray-900">{user.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-medium text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-900">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Joined</dt>
            <dd className="font-medium text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
