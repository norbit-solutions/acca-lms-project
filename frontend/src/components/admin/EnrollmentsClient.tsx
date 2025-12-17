"use client";
import { useState } from "react";
import type { Enrollment, AdminCourse, User } from "@/types";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";
import { useRouter } from "next/navigation";

// Icons
const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-12 h-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export default function EnrollmentsClient({
  initialEnrollments = [],
  initialCourses = [],
}: {
  initialEnrollments?: Enrollment[];
  initialCourses?: AdminCourse[];
}) {
  const { showError, showConfirm } = useModal();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [filterCourse, setFilterCourse] = useState<number | null>(null);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const router = useRouter();





  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const data = await adminService.searchUsers(searchQuery);
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
      showError("Please select both a user and a course");
      return;
    }
    try {
      await adminService.createEnrollment({
        userId: selectedUser.id,
        courseId: selectedCourse,
      });


      setShowModal(false);
      setSelectedUser(null);
      setSelectedCourse(null);
      setSearchQuery("");
      router.refresh();
    } catch (error: unknown) {
      console.error("Failed to enroll:", error);
      showError((error as any)?.response?.data?.message || "Failed to enroll user");
    }
  };

  const handleDelete = async (enrollment: Enrollment) => {
    const confirmed = await showConfirm({
      title: "Remove Enrollment",
      message: `Remove ${enrollment.user?.fullName} from ${enrollment.course?.title}?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteEnrollment(enrollment.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete enrollment:", error);
      showError("Failed to remove enrollment");
    }
  };

  const handleEdit = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setSelectedCourse(null);
    setShowEditModal(true);
  };

  const handleEnrollAdditional = async () => {
    if (!editingEnrollment || !selectedCourse) {
      showError("Please select a course");
      return;
    }
    try {
      await adminService.createEnrollment({
        userId: editingEnrollment.user!.id,
        courseId: selectedCourse,
      });
      setShowEditModal(false);
      setEditingEnrollment(null);
      setSelectedCourse(null);
      router.refresh();
    } catch (error: unknown) {
      console.error("Failed to enroll:", error);
      showError((error as any)?.response?.data?.message || "Failed to enroll in course");
    }
  };

  // Get courses the student is NOT enrolled in
  const getAvailableCourses = () => {
    if (!editingEnrollment) return [];
    const enrolledCourseIds = initialEnrollments
      .filter(e => e.user?.id === editingEnrollment.user?.id)
      .map(e => e.course?.id);
    return (Array.isArray(initialCourses) ? initialCourses : []).filter(
      course => !enrolledCourseIds.includes(course.id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Enrollments
          </h1>
          <p className="text-slate-500 mt-1">
            Manage student course enrollments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all duration-200"
        >
          <PlusIcon />
          New Enrollment
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <FilterIcon />
            <span className="font-semibold">Filter by Course</span>
          </div>
          <select
            value={filterCourse || ""}
            onChange={(e) =>
              setFilterCourse(e.target.value ? Number(e.target.value) : null)
            }
            className="flex-1 sm:flex-initial sm:min-w-[250px] px-0 py-2.5 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
          >
            <option value="">All Courses</option>
            {(Array.isArray(initialCourses) ? initialCourses : []).map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {filterCourse && (
            <button
              onClick={() => setFilterCourse(null)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <CloseIcon />
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {initialEnrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Enrolled Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialEnrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0">
                          {enrollment.user?.fullName.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {enrollment.user?.fullName || "Unknown User"}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {enrollment.user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">
                        {enrollment.course?.title || "Unknown Course"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-slate-500 text-sm">
                        {new Date(enrollment.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(enrollment)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                        >
                          <EditIcon />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(enrollment)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
                        >
                          <TrashIcon />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <UsersIcon />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
              No enrollments yet
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Get started by enrolling students in your courses.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all"
            >
              <PlusIcon />
              Enroll a Student
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-display font-bold text-slate-900">
                New Enrollment
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setSelectedCourse(null);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* User Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Find Student
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                      placeholder="Search by email or phone..."
                    />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500">
                      <SearchIcon />
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-colors disabled:opacity-50"
                  >
                    {searching ? "..." : "Search"}
                  </button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-sm">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-semibold text-slate-900">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {user.email} • {user.phone}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected User */}
              {selectedUser && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-sm">
                      {selectedUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {selectedUser.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery("");
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse || ""}
                  onChange={(e) => setSelectedCourse(Number(e.target.value))}
                  className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                >
                  <option value="">Choose a course...</option>
                  {(Array.isArray(initialCourses) ? initialCourses : []).map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setSelectedCourse(null);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                disabled={!selectedUser || !selectedCourse}
                className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Enroll Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Enrollment Modal */}
      {showEditModal && editingEnrollment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-display font-bold text-slate-900">
                Enroll in Additional Course
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEnrollment(null);
                  setSelectedCourse(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Student Info */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {editingEnrollment.user?.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {editingEnrollment.user?.fullName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {editingEnrollment.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Enrollments */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Currently Enrolled In
                </label>
                <div className="space-y-2">
                  {initialEnrollments
                    .filter(e => e.user?.id === editingEnrollment.user?.id)
                    .map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium"
                      >
                        {enrollment.course?.title}
                      </div>
                    ))}
                </div>
              </div>

              {/* Available Courses */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enroll in New Course
                </label>
                {getAvailableCourses().length > 0 ? (
                  <select
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(Number(e.target.value))}
                    className="w-full px-0 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
                  >
                    <option value="">Choose a course...</option>
                    {getAvailableCourses().map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    This student is already enrolled in all available courses.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEnrollment(null);
                  setSelectedCourse(null);
                }}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollAdditional}
                disabled={!selectedCourse}
                className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Enroll in Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
