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
        className="px-6 py-4 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </span>
          <div>
            <span className="font-medium text-slate-900">
              Chapter {chapterIndex + 1}: {chapter.title}
            </span>
            <span className="ml-3 text-sm text-slate-500">
              ({chapter.lessons.length} lessons)
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onAddLesson}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Lesson
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
            <div className="px-6 py-4 pl-14 text-slate-400 text-sm">
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
