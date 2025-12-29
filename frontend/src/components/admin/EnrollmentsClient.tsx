"use client";
import { useState } from "react";
import type { Enrollment, AdminCourse, User } from "@/types";
import { adminService } from "@/services";
import { useModal } from "./ModalProvider";
import { useRouter } from "next/navigation";

// Icons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function EnrollmentsClient({
  initialEnrollments = [],
  initialCourses = [],
}: {
  initialEnrollments?: Enrollment[];
  initialCourses?: AdminCourse[];
}) {
  const { showError, showSuccess, showConfirm } = useModal();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [filterCourse, setFilterCourse] = useState<number | null>(null);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const data = await adminService.searchUsers(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to search users:", error);
      showError("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery(user.email);
  };

  const toggleCourse = (courseId: number) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleEnroll = async () => {
    if (!selectedUser || selectedCourses.size === 0) {
      showError("Please select a user and at least one course");
      return;
    }

    setEnrolling(true);
    let successCount = 0;
    let errorCount = 0;

    for (const courseId of selectedCourses) {
      try {
        await adminService.createEnrollment({
          userId: selectedUser.id,
          courseId,
        });
        successCount++;
      } catch (error) {
        console.error("Failed to enroll in course:", courseId, error);
        errorCount++;
      }
    }

    setEnrolling(false);

    if (successCount > 0) {
      showSuccess(`Enrolled in ${successCount} course${successCount > 1 ? 's' : ''}`);
    }
    if (errorCount > 0) {
      showError(`Failed to enroll in ${errorCount} course${errorCount > 1 ? 's' : ''}`);
    }

    setShowModal(false);
    setSelectedUser(null);
    setSelectedCourses(new Set());
    setSearchQuery("");
    router.refresh();
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
    setSelectedCourses(new Set());
    setShowEditModal(true);
  };

  const handleEnrollAdditional = async () => {
    if (!editingEnrollment || selectedCourses.size === 0) {
      showError("Please select at least one course");
      return;
    }

    setEnrolling(true);
    let successCount = 0;
    let errorCount = 0;

    for (const courseId of selectedCourses) {
      try {
        await adminService.createEnrollment({
          userId: editingEnrollment.user!.id,
          courseId,
        });
        successCount++;
      } catch (error) {
        console.error("Failed to enroll:", error);
        errorCount++;
      }
    }

    setEnrolling(false);

    if (successCount > 0) {
      showSuccess(`Enrolled in ${successCount} course${successCount > 1 ? 's' : ''}`);
    }
    if (errorCount > 0) {
      showError(`Failed to enroll in ${errorCount} course${errorCount > 1 ? 's' : ''}`);
    }

    setShowEditModal(false);
    setEditingEnrollment(null);
    setSelectedCourses(new Set());
    router.refresh();
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

  const courses = Array.isArray(initialCourses) ? initialCourses : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Enrollments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage student course access</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
        >
          <PlusIcon />
          New Enrollment
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 py-3 border-b border-slate-100">
        <FilterIcon />
        <select
          value={filterCourse || ""}
          onChange={(e) => setFilterCourse(e.target.value ? Number(e.target.value) : null)}
          className="text-sm bg-transparent border-0 focus:ring-0 text-slate-600 cursor-pointer"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        {filterCourse && (
          <button onClick={() => setFilterCourse(null)} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {initialEnrollments.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-medium">
                        {enrollment.user?.fullName.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{enrollment.user?.fullName || "Unknown"}</p>
                        <p className="text-xs text-slate-400">{enrollment.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{enrollment.course?.title || "Unknown"}</td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                    {(() => {
                      const dateStr = enrollment.enrolledAt || enrollment.createdAt;
                      if (!dateStr) return "—";
                      const date = new Date(dateStr);
                      return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    })()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(enrollment)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        title="Add courses"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <div className="text-slate-300 mb-4 flex justify-center">
              <UsersIcon />
            </div>
            <p className="text-slate-500 mb-4">No enrollments yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-slate-900 underline underline-offset-4 hover:no-underline"
            >
              Enroll a student
            </button>
          </div>
        )}
      </div>

      {/* New Enrollment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-medium text-slate-900">New Enrollment</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setSelectedCourses(new Set());
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* User Search */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Find Student</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-0 outline-none"
                      placeholder="Search by email or phone..."
                    />
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <SearchIcon />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    {searching ? "..." : "Search"}
                  </button>
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full px-3 py-2.5 text-left hover:bg-slate-50 text-sm"
                      >
                        <p className="font-medium text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected User */}
                {selectedUser && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                        {selectedUser.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedUser.fullName}</p>
                        <p className="text-xs text-slate-400">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setSearchQuery("");
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                )}
              </div>

              {/* Course Selection - Multi-select */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                  Select Courses ({selectedCourses.size} selected)
                </label>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCourses.has(course.id)
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "border-slate-300"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCourse(course.id);
                        }}
                      >
                        {selectedCourses.has(course.id) && <CheckIcon />}
                      </div>
                      <span className="text-sm text-slate-700">{course.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setSelectedCourses(new Set());
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                disabled={!selectedUser || selectedCourses.size === 0 || enrolling}
                className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {enrolling ? "Enrolling..." : `Enroll in ${selectedCourses.size} Course${selectedCourses.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Enrollment Modal */}
      {showEditModal && editingEnrollment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-medium text-slate-900">Add Courses</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEnrollment(null);
                  setSelectedCourses(new Set());
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* Student Info */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                    {editingEnrollment.user?.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{editingEnrollment.user?.fullName}</p>
                    <p className="text-xs text-slate-400">{editingEnrollment.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Current Enrollments */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Current Enrollments</label>
                <div className="flex flex-wrap gap-1.5">
                  {initialEnrollments
                    .filter(e => e.user?.id === editingEnrollment.user?.id)
                    .map((enrollment) => (
                      <span
                        key={enrollment.id}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        {enrollment.course?.title}
                      </span>
                    ))}
                </div>
              </div>

              {/* Available Courses - Multi-select */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                  Add New Courses ({selectedCourses.size} selected)
                </label>
                {getAvailableCourses().length > 0 ? (
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {getAvailableCourses().map((course) => (
                      <label
                        key={course.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCourses.has(course.id)
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "border-slate-300"
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCourse(course.id);
                          }}
                        >
                          {selectedCourses.has(course.id) && <CheckIcon />}
                        </div>
                        <span className="text-sm text-slate-700">{course.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Already enrolled in all courses.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEnrollment(null);
                  setSelectedCourses(new Set());
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollAdditional}
                disabled={selectedCourses.size === 0 || enrolling}
                className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {enrolling ? "Enrolling..." : `Add ${selectedCourses.size} Course${selectedCourses.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
