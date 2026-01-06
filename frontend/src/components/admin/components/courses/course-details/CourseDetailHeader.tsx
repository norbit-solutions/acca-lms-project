"use client";

import Link from "next/link";
import { AdminCourseDetail } from "@/types";
import { BackIcon } from "@/lib/icons";

interface CourseDetailHeaderProps {
  course: AdminCourseDetail;
}

export default function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
  const totalLessons = course.chapters.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div className="mb-8">
      {/* Back Button + Title Row */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/courses"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
        >
          <BackIcon className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
            {course.title}
          </h1>
          <span
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
              course.isPublished
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {course.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Thumbnail Banner */}
        {course.thumbnail && (
          <div className="relative w-full h-32 md:h-40 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        <div className="p-4 md:p-5">
          {/* Description */}
          {course.description && (
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xl md:text-2xl font-semibold text-slate-900">
                {course.chapters.length}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Chapters
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xl md:text-2xl font-semibold text-slate-900">
                {totalLessons}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Lessons
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-xl md:text-2xl font-semibold text-slate-900">
                {course.enrollmentsCount || 0}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Enrolled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
