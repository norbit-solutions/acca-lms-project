"use client";

import { AdminUser, UserEnrollment } from "@/types";
import { BookIcon, TrashIcon, CalendarIcon } from "@/lib/icons";

interface UserEnrollmentsProps {
  user: AdminUser;
  onRemoveEnrollment: (enrollment: UserEnrollment) => void;
}

export default function UserEnrollments({
  user,
  onRemoveEnrollment,
}: UserEnrollmentsProps) {
  const enrollmentCount = user.enrollments?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <BookIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Course Enrollments
              </h2>
              <p className="text-sm text-slate-500">
                {enrollmentCount} active {enrollmentCount === 1 ? "enrollment" : "enrollments"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {enrollmentCount > 0 ? (
        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
          {user.enrollments?.map((enrollment) => (
            <div
              key={enrollment.id}
              className="px-6 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <p className="font-medium text-slate-900 truncate">
                      {enrollment.course.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>
                      Enrolled{" "}
                      {enrollment.createdAt
                        ? new Date(enrollment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unknown date"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveEnrollment(enrollment)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <BookIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No course enrollments</p>
          <p className="text-sm text-slate-400 mt-1">
            This user hasn&apos;t enrolled in any courses yet
          </p>
        </div>
      )}
    </div>
  );
}
