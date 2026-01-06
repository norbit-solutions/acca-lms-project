"use client";

import { useRouter } from "next/navigation";
import { AdminChapter, AdminLesson } from "@/types";
import { adminService } from "@/services";
import { showError } from "@/lib/toast";
import { useConfirm } from "@/components/ConfirmProvider";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
} from "@/lib/icons";
import LessonItem from "./LessonItem";

interface ChapterItemProps {
  chapter: AdminChapter;
  chapterIndex: number;
  courseId: number;
  isExpanded: boolean;
  processingLessons: Set<number>;
  onToggle: () => void;
  onEdit: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: AdminLesson) => void;
  onProcessingChange: (lessonId: number, isProcessing: boolean) => void;
}

export default function ChapterItem({
  chapter,
  chapterIndex,
  courseId,
  isExpanded,
  processingLessons,
  onToggle,
  onEdit,
  onAddLesson,
  onEditLesson,
  onProcessingChange,
}: ChapterItemProps) {
  const router = useRouter();
  const { showConfirm } = useConfirm();

  // Handle delete chapter
  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: "Delete Chapter",
      message: `Delete "${chapter.title}" and all its lessons?`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await adminService.deleteChapter(chapter.id);
      router.refresh();
    } catch (error) {
      console.log("Failed to delete chapter:", error);
      showError("Failed to delete chapter");
    }
  };

  return (
    <div>
      {/* Chapter Header */}
      <div
        className="px-4 md:px-6 py-4 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start md:items-center justify-between gap-3">
          <div className="flex items-start md:items-center gap-2 md:gap-3 flex-1 min-w-0">
            <span className="text-slate-400 shrink-0 mt-1 md:mt-0">
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="font-medium text-slate-900 text-sm md:text-base">
                  Chapter {chapterIndex + 1}: {chapter.title}
                </span>
                <span className="text-xs md:text-sm text-slate-500">
                  ({chapter.lessons.length} lessons)
                </span>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-1 md:gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onAddLesson}
              className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Lesson</span>
            </button>
            <button
              onClick={onEdit}
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
        </div>
      </div>

      {/* Lessons */}
      {isExpanded && (
        <div className="bg-white">
          {chapter.lessons.length > 0 ? (
            chapter.lessons
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((lesson, lessonIndex) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  lessonIndex={lessonIndex}
                  courseId={courseId}
                  processingLessons={processingLessons}
                  onEdit={onEditLesson}
                  onProcessingChange={onProcessingChange}
                />
              ))
          ) : (
            <div className="px-4 md:px-6 py-4 pl-10 md:pl-14 text-slate-400 text-sm">
              No lessons yet.{" "}
              <button
                onClick={onAddLesson}
                className="text-slate-900 hover:underline font-medium"
              >
                Add one
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
