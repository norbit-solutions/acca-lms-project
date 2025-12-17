"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services";
import type { AdminUser, UserEnrollment } from "@/types";
import { useModal } from "./ModalProvider";

interface UserDetailClientProps {
  initialUser: AdminUser;
}

export default function UserDetailClient({
  initialUser,
}: UserDetailClientProps) {
  const router = useRouter();
  const { showError, showConfirm, showSuccess } = useModal();
  const [user, setUser] = useState<AdminUser>(initialUser);
  const [editingViewLimit, setEditingViewLimit] = useState<{
    lessonId: number;
    lessonTitle: string;
    currentLimit: number | null;
  } | null>(null);
  const [newLimit, setNewLimit] = useState<string>("");

  const BackIcon = () => (
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
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
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

  const loadUser = async () => {
    try {
      const data = await adminService.getUser(user.id);
      setUser(data || null);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const handleRemoveEnrollment = async (enrollment: UserEnrollment) => {
    const confirmed = await showConfirm({
      title: "Remove Enrollment",
      message: `Remove enrollment from ${enrollment.course.title}?`,
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteEnrollment(enrollment.id);
      loadUser();
    } catch (error) {
      console.error("Failed to remove enrollment:", error);
      showError("Failed to remove enrollment");
    }
  };

  const openViewLimitModal = (view: any) => {
    setEditingViewLimit({
      lessonId: view.lessonId,
      lessonTitle: view.lessonTitle || 'Unknown Lesson',
      currentLimit: view.customViewLimit || null,
    });
    setNewLimit(view.customViewLimit?.toString() || "");
  };

  const handleSetViewLimit = async () => {
    if (!editingViewLimit) return;

    const limitValue = parseInt(newLimit, 10);
    if (isNaN(limitValue) || limitValue < 0) {
      showError("Please enter a valid number (0 or greater)");
      return;
    }

    try {
      await adminService.setUserViewLimit(user.id, editingViewLimit.lessonId, limitValue);
      showSuccess("View limit updated successfully");
      setEditingViewLimit(null);
      loadUser();
    } catch (error) {
      console.error("Failed to set view limit:", error);
      showError("Failed to set view limit");
    }
  };

  const handleRemoveViewLimit = async () => {
    if (!editingViewLimit) return;

    try {
      await adminService.removeUserViewLimit(user.id, editingViewLimit.lessonId);
      showSuccess("Custom view limit removed");
      setEditingViewLimit(null);
      loadUser();
    } catch (error) {
      console.error("Failed to remove view limit:", error);
      showError("Failed to remove view limit");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/users")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-4 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <BackIcon />
          </div>
          <span className="font-medium">Back to Users</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.fullName ? user.fullName.charAt(0) : "?"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.fullName || "Unknown User"}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-gray-500">{user.email}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{user.phone}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${user.role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-600"
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
              Enrollments ({user?.enrollmentsCount || 0})
            </h2>
          </div>
          {user?.enrollmentsCount && user.enrollmentsCount > 0 ? (
            <div className="divide-y divide-gray-100">
              {user.enrollments?.map(
                (enrollment) => (
                  <div
                    key={enrollment.id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {enrollment.course.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Enrolled{" "}
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveEnrollment(enrollment)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
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
              Video Views ({user?.videoViews ? user.videoViews.length : 0})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Click to adjust view limits for this user
            </p>
          </div>
          {user?.videoViews && user.videoViews.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {(Array.isArray(user.videoViews) ? user.videoViews : []).map(
                (view: any) => (
                  <div
                    key={view.id}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openViewLimitModal(view)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {view.lessonTitle || 'Unknown Lesson'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {view.courseTitle || 'Unknown Course'}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {view.viewCount} views
                          </p>
                          <p className="text-sm text-gray-500">
                            {view.customViewLimit ? (
                              <span className="text-blue-600 font-medium">
                                Custom limit: {view.customViewLimit}
                              </span>
                            ) : (
                              'Default limit'
                            )}
                          </p>
                        </div>
                        <div className="text-gray-400 hover:text-blue-600">
                          <EditIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h2>
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

      {/* View Limit Modal */}
      {editingViewLimit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Set View Limit
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {editingViewLimit.lessonTitle}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom View Limit
              </label>
              <input
                type="number"
                min="0"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder="Enter number of views allowed"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Leave empty or set to 0 to use default lesson limit. Current usage: {user.videoViews?.find((v: any) => v.lessonId === editingViewLimit.lessonId)?.viewCount || 0} views.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-xl">
              <button
                onClick={handleRemoveViewLimit}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Remove Custom Limit
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingViewLimit(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetViewLimit}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Limit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
