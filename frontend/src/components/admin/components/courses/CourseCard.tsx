"use client";

import Link from "next/link";
import type { AdminCourse } from "@/types";
import { BookIcon, ChapterIcon, LessonIcon, EditIcon, TrashIcon } from "@/lib/icons";

interface CourseCardProps {
  course: AdminCourse;
  onEdit: (course: AdminCourse) => void;
  onDelete: (course: AdminCourse) => void;
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="relative h-44 bg-slate-50 flex items-center justify-center overflow-hidden">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-slate-400 group-hover:scale-110 transition-transform duration-300">
            <BookIcon className="w-12 h-12" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0"></div>
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              course.isPublished
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-900/70 text-slate-200"
            }`}
          >
            {course.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-slate-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-10">
          {course.description || "No description provided"}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5 py-3 border-y border-slate-100">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <ChapterIcon />
            <span className="font-semibold">{course.chaptersCount || 0}</span>
            <span className="text-slate-400">chapters</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <LessonIcon />
            <span className="font-semibold">{course.lessonsCount || 0}</span>
            <span className="text-slate-400">lessons</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/admin/courses/${course.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Manage Content
          </Link>
          <button
            onClick={() => onEdit(course)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
