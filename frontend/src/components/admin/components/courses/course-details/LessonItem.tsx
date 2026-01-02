"use client";

import { useState } from "react";
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

  return (
    <Link
      href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
      className="px-6 py-3 pl-14 flex items-center justify-between border-t border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Video thumbnail or status indicator */}
        {lesson.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lesson.thumbnailUrl}
            alt="Video thumbnail"
            className="w-14 h-8 object-cover rounded border border-slate-200"
          />
        ) : lesson.muxStatus === "error" ? (
          <div className="w-14 h-8 bg-red-50 rounded border border-red-200 flex items-center justify-center">
            <span className="text-[10px] text-red-600 font-medium">Error</span>
          </div>
        ) : lesson.type === "video" && isProcessing ? (
          <div className="w-14 h-8 bg-amber-50 rounded border border-amber-200 flex items-center justify-center">
            <span className="text-[10px] text-amber-600 font-medium">
              Processing
            </span>
          </div>
        ) : lesson.type === "video" ? (
          <div className="w-14 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
            <span className="text-[10px] text-slate-400">No video</span>
          </div>
        ) : lesson.type === "pdf" ? (
          <div className="w-14 h-8 bg-blue-50 rounded border border-blue-200 flex items-center justify-center">
            <span className="text-[10px] text-blue-600 font-medium">PDF</span>
          </div>
        ) : (
          <div className="w-14 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
            <span className="text-[10px] text-slate-400">Text</span>
          </div>
        )}

        <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-500 font-medium">
          {lessonIndex + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-900">{lesson.title}</span>
        </div>
        {lesson.isFree && (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
            Free
          </span>
        )}
        <span className="text-sm text-slate-400">
          {formatDuration(lesson.duration)}
        </span>
        {lesson.muxPlaybackId ? (
          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
            <CheckIcon className="w-4 h-4" /> Ready
          </span>
        ) : lesson.type === "video" && isProcessing ? (
          <span className="inline-flex items-center gap-1 text-amber-500 text-xs">
            <WarningIcon className="w-4 h-4" /> Processing
          </span>
        ) : null}
      </div>
      <div
        className="flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Upload progress bar */}
        {uploadProgress !== null && (
          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        <button
          onClick={handleUploadVideo}
          disabled={isUploading}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors disabled:opacity-50 min-w-[70px] justify-center"
        >
          <UploadIcon className="w-4 h-4" />
          {uploadProgress !== null
            ? `${uploadProgress}%`
            : lesson.muxPlaybackId
              ? "Replace"
              : "Upload"}
        </button>
        {/* Sync button - shown when video is processing (webhooks may not work locally) */}
        {isProcessing && !lesson.muxPlaybackId && (
          <button
            onClick={handleSyncMux}
            disabled={isSyncing}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
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
