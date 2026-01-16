"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@/lib";
import LessonItem from "./LessonItem";

interface ChapterLesson {
  id: number;
  title: string;
  sortOrder: number;
  duration: number | null;
  isCompleted: boolean;
  canWatch: boolean;
  viewCount: number;
  maxViews: number;
}

interface ChapterAccordionProps {
  chapter: {
    id: number;
    title: string;
    lessons: ChapterLesson[];
  };
  chapterIndex: number;
  courseSlug: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ChapterAccordion({
  chapter,
  chapterIndex,
  courseSlug,
  isExpanded,
  onToggle,
}: ChapterAccordionProps) {
  const completedInChapter = chapter.lessons.filter(l => l.isCompleted).length;
  const totalInChapter = chapter.lessons.length;
  const isComplete = completedInChapter === totalInChapter && totalInChapter > 0;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Chapter Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-[#333c8a]">
            {chapterIndex + 1}
          </span>
          <div className="text-left">
            <p className="font-medium text-[#333c8a] text-sm">
              {chapter.title}
            </p>
            <p className="text-xs text-gray-400">
              {completedInChapter}/{totalInChapter} lessons
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isComplete && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Complete
            </span>
          )}
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </span>
        </div>
      </button>

      {/* Lessons */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          {chapter.lessons
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((lesson, lessonIndex) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                lessonIndex={lessonIndex}
                courseSlug={courseSlug}
              />
            ))}
        </div>
      )}
    </div>
  );
}
