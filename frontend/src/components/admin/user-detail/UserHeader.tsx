"use client";

import { AdminUser } from "@/types";
import { BackIcon, EmailIcon, PhoneIcon, CalendarIcon, BookIcon, PlayCircleIcon } from "@/lib/icons";
import { useRouter } from "next/navigation";

interface UserHeaderProps {
  user: AdminUser;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin/users")}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
          <BackIcon className="w-4 h-4" />
        </div>
        <span className="font-medium">Back to Users</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Top Section with Avatar & Name */}
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-2xl font-bold shrink-0">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
            </div>
            
            {/* Name & Role */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {user?.fullName || "Unknown User"}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              <p className="text-slate-500 mt-1">User ID: #{user.id}</p>
            </div>
          </div>
        </div>

        {/* Contact Info & Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <EmailIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-slate-900 truncate" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <PhoneIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Joined</p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Courses Stat */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <BookIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Courses</p>
                <p className="text-sm font-bold text-slate-900">
                  {user.enrollments?.length || 0} enrolled
                </p>
              </div>
            </div>

            {/* Lessons Stat */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <PlayCircleIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Lessons</p>
                <p className="text-sm font-bold text-slate-900">
                  {user.videoViews?.length || 0} watched
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

