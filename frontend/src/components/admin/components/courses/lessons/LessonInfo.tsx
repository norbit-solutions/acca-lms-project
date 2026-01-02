"use client";

import { EditIcon, ClockIcon, EyeIcon, CheckIcon } from "@/lib/icons";
import { formatDuration } from "@/lib/helpers";

interface LessonInfoProps {
  title: string;
  description: string | null;
  type: 'video' | 'text' | 'pdf';
  duration: number | null;
  viewLimit: number;
  isFree: boolean;
  chapterTitle: string;
  courseTitle: string;
  onEdit: () => void;
}

export default function LessonInfo({
  title,
  description,
  type,
  duration,
  viewLimit,
  isFree,
  chapterTitle,
  courseTitle,
  onEdit,
}: LessonInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <h2 className="font-display font-semibold text-slate-900 truncate">Lesson Details</h2>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors shrink-0"
        >
          <EditIcon className="w-4 h-4" />
          Edit
        </button>
      </div>
      
      <div className="p-4 sm:p-6 space-y-5">
        {/* Title & Description */}
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 break-words">{title}</h3>
          {description ? (
            <p className="text-sm sm:text-base text-slate-600 break-words">{description}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No description</p>
          )}
        </div>

        {/* Metadata Grid - 2x2 on all screens for better fit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
            <p className="text-xs sm:text-sm font-medium text-slate-900 capitalize truncate">{type}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide mb-1">Duration</p>
            <p className="text-xs sm:text-sm font-medium text-slate-900 flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
              <span className="truncate">{formatDuration(duration)}</span>
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide mb-1">View Limit</p>
            <p className="text-xs sm:text-sm font-medium text-slate-900 flex items-center gap-1">
              <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
              <span className="truncate">{viewLimit} views</span>
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide mb-1">Access</p>
            <p className="text-xs sm:text-sm font-medium truncate">
              {isFree ? (
                <span className="text-emerald-600 inline-flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Free
                </span>
              ) : (
                <span className="text-slate-900">Paid</span>
              )}
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="pt-4 border-t border-slate-100 min-w-0">
          <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide mb-2">Location</p>
          <p className="text-xs sm:text-sm text-slate-600 break-words">
            <span className="font-medium text-slate-900">{courseTitle}</span>
            <span className="mx-1">→</span>
            <span>{chapterTitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
