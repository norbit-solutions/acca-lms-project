"use client";

import { PlusIcon } from "@/lib/icons";

interface CoursesHeaderProps {
  onAddCourse: () => void;
}

export default function CoursesHeader({ onAddCourse }: CoursesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          Courses
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your educational content and curriculum
        </p>
      </div>
      <button
        onClick={onAddCourse}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        New Course
      </button>
    </div>
  );
}
