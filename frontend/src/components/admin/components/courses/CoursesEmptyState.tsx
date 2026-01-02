"use client";

import { BookIcon, PlusIcon } from "@/lib/icons";

interface CoursesEmptyStateProps {
  onAddCourse: () => void;
}

export default function CoursesEmptyState({ onAddCourse }: CoursesEmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
        <BookIcon className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
        No courses yet
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Get started by creating your first course. Build engaging content
        for your students.
      </p>
      <button
        onClick={onAddCourse}
        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all"
      >
        <PlusIcon className="w-4 h-4" />
        Create Your First Course
      </button>
    </div>
  );
}
