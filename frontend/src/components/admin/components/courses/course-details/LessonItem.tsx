"use client";

import Link from "next/link";
import { AdminLesson } from "@/types";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { formatDuration } from "@/lib/helpers";
import { useConfirm } from "@/components/ConfirmProvider";
import { useVideoUpload } from "@/hooks";
import {
  UploadIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  WarningIcon,
} from "@/lib/icons";
import { useRouter } from "next/navigation";

interface LessonItemProps {
  lesson: AdminLesson;
  lessonIndex: number;
  courseId: number;
  processingLessons: Set<number>;
  onEdit: (lesson: AdminLesson) => void;
  onProcessingChange: (lessonId: number, isProcessing: boolean) => void;
}

export default function LessonItem({
  lesson,
  lessonIndex,
  courseId,
  processingLessons,
  onEdit,
  onProcessingChange,
}: LessonItemProps) {
  const router = useRouter();
  const { showConfirm } = useConfirm();

  // Use shared video upload hook
  const {
    isUploading,
    uploadProgress,
    isSyncing,
    handleUploadVideo,
    handleSyncMux,
  } = useVideoUpload({
    lessonId: lesson.id,
    onProcessingChange,
  });

  const isProcessing =
    processingLessons.has(lesson.id) ||
    (lesson.muxStatus === "pending" && lesson.muxUploadId);

  // Handle delete
  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: "Delete Lesson",
      message: `Delete "${lesson.title}"?`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteLesson(lesson.id);
      router.refresh();
    } catch (error) {
      console.log("Failed to delete lesson:", error);
      showError("Failed to delete lesson");
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    if (lesson.muxPlaybackId) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
          <CheckIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Ready</span>
        </span>
      );
    }
    if (lesson.type === "video" && isProcessing) {
      return (
        <span className="inline-flex items-center gap-1 text-amber-500 text-xs">
          <WarningIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Processing</span>
        </span>
      );
    }
    return null;
  };

  // Get thumbnail/status indicator
  const getThumbnail = () => {
    if (lesson.thumbnailUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lesson.thumbnailUrl}
          alt="Video thumbnail"
          className="w-10 h-6 md:w-14 md:h-8 object-cover rounded border border-slate-200"
        />
      );
    }
    if (lesson.muxStatus === "error") {
      return (
        <div className="w-10 h-6 md:w-14 md:h-8 bg-red-50 rounded border border-red-200 flex items-center justify-center">
          <span className="text-[8px] md:text-[10px] text-red-600 font-medium">Error</span>
        </div>
      );
    }
    if (lesson.type === "video" && isProcessing) {
      return (
        <div className="w-10 h-6 md:w-14 md:h-8 bg-amber-50 rounded border border-amber-200 flex items-center justify-center">
          <span className="text-[8px] md:text-[10px] text-amber-600 font-medium">...</span>
        </div>
      );
    }
    if (lesson.type === "video") {
      return (
        <div className="w-10 h-6 md:w-14 md:h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
          <span className="text-[8px] md:text-[10px] text-slate-400">No video</span>
        </div>
      );
    }
    if (lesson.type === "pdf") {
      return (
        <div className="w-10 h-6 md:w-14 md:h-8 bg-blue-50 rounded border border-blue-200 flex items-center justify-center">
          <span className="text-[8px] md:text-[10px] text-blue-600 font-medium">PDF</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-6 md:w-14 md:h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
        <span className="text-[8px] md:text-[10px] text-slate-400">Text</span>
      </div>
    );
  };

  return (
    <Link
      href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
      className="px-4 md:px-6 py-3 pl-8 md:pl-14 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between border-t border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
    >
      {/* Lesson Info */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        {getThumbnail()}
        
        <span className="w-5 h-5 md:w-6 md:h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] md:text-xs text-slate-500 font-medium shrink-0">
          {lessonIndex + 1}
        </span>
        
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm md:text-base text-slate-900 truncate">{lesson.title}</span>
          {lesson.isFree && (
            <span className="px-1.5 md:px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-medium rounded-full shrink-0">
              Free
            </span>
          )}
        </div>
        
        <span className="text-xs md:text-sm text-slate-400 shrink-0 hidden sm:block">
          {formatDuration(lesson.duration)}
        </span>
        
        {getStatusBadge()}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 md:gap-2 ml-auto sm:ml-0"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Upload progress bar */}
        {uploadProgress !== null && (
          <div className="w-16 md:w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        <button
          onClick={handleUploadVideo}
          disabled={isUploading}
          className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors disabled:opacity-50"
        >
          <UploadIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">
            {uploadProgress !== null
              ? `${uploadProgress}%`
              : lesson.muxPlaybackId
                ? "Replace"
                : "Upload"}
          </span>
        </button>
        
        {/* Sync button - shown when video is processing */}
        {isProcessing && !lesson.muxPlaybackId && (
          <button
            onClick={handleSyncMux}
            disabled={isSyncing}
            className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
            title="Check if video is ready"
          >
            {isSyncing ? "..." : "Sync"}
          </button>
        )}
        
        <button
          onClick={() => onEdit(lesson)}
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <EditIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleDelete}
          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}
