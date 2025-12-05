"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

interface Course {
  id: number;
  title: string;
}

interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  user: User;
  course: Course;
  createdAt: string;
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [filterCourse, setFilterCourse] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEnrollments();
  }, [filterCourse]);

  const loadData = async () => {
    try {
      const [enrollmentsRes, coursesRes] = await Promise.all([
        adminApi.getEnrollments(),
        adminApi.getCourses(),
      ]);
      setEnrollments(enrollmentsRes.data?.enrollments || []);
      setCourses(coursesRes.data?.courses || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      const { data } = await adminApi.getEnrollments(
        filterCourse ? { courseId: filterCourse } : undefined
      );
      setEnrollments(data?.enrollments || data || []);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const { data } = await adminApi.searchUsers(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery(user.email);
  };

  const handleEnroll = async () => {
    if (!selectedUser || !selectedCourse) {
      alert("Please select both a user and a course");
      return;
    }
    try {
      await adminApi.createEnrollment({
        userId: selectedUser.id,
        courseId: selectedCourse,
      });
      setShowModal(false);
      setSelectedUser(null);
      setSelectedCourse(null);
      setSearchQuery("");
      loadEnrollments();
    } catch (error: any) {
      console.error("Failed to enroll:", error);
      alert(error.response?.data?.message || "Failed to enroll user");
    }
  };

  const handleDelete = async (enrollment: Enrollment) => {
    if (
      !confirm(
        `Remove ${enrollment.user.fullName} from ${enrollment.course.title}?`
      )
    )
      return;
    try {
      await adminApi.deleteEnrollment(enrollment.id);
      loadEnrollments();
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
      alert("Failed to remove enrollment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Enrollment
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by Course:
          </label>
          <select
            value={filterCourse || ""}
            onChange={(e) =>
              setFilterCourse(e.target.value ? Number(e.target.value) : null)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {(Array.isArray(courses) ? courses : []).map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {enrollments.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {enrollment.user.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {enrollment.user.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {enrollment.user.phone}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {enrollment.course.title}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(enrollment)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-gray-500 mb-4">No enrollments yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enroll a Student
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              New Enrollment
            </h2>

            {/* User Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Find Student
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by email or phone..."
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email} • {user.phone}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected User */}
              {selectedUser && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedUser.fullName}
                    </p>
                    <p className="text-sm text-blue-700">
                      {selectedUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery("");
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Course Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select
                value={selectedCourse || ""}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setSelectedCourse(null);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                disabled={!selectedUser || !selectedCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Enroll Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
