"use client";

import { BookIcon, PlusIcon } from "@/lib/icons";

interface EmptyChaptersStateProps {
  onAddChapter: () => void;
}

export default function EmptyChaptersState({ onAddChapter }: EmptyChaptersStateProps) {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
        <BookIcon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
        No chapters yet
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Start building your course by adding chapters and lessons.
      </p>
      <button
        onClick={onAddChapter}
        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all"
      >
        <PlusIcon className="w-4 h-4" />
        Add First Chapter
      </button>
    </div>
  );
}
