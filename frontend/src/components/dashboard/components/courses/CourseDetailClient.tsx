"use client";

import { useState } from "react";
import type { CourseWithProgress } from "@/types";
import {
  CourseBackButton,
  CourseInfoCard,
  ChapterAccordion,
} from "./index";

interface CourseDetailClientProps {
  course: CourseWithProgress;
  slug: string;
}

export default function CourseDetailClient({ course, slug }: CourseDetailClientProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set(course.chapters.map((c) => c.id))
  );

  const toggleChapter = (chapterId: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // Calculate total duration
  const totalDuration = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.reduce(
      (chTotal, lesson) => chTotal + (lesson.duration || 0), 0
    ), 0
  );

  return (
    <div className="w-full">
      <CourseBackButton />

      <CourseInfoCard
        title={course.title}
        description={course.description ?? undefined}
        thumbnail={course.thumbnail ?? undefined}
        chaptersCount={course.chapters.length}
        lessonsCount={course.progress.total}
        totalDuration={totalDuration}
        completedLessons={course.progress.completed}
        progressPercentage={course.progress.percentage}
      />

      {/* Chapters List */}
      <div className="space-y-2">
        {course.chapters
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((chapter, chapterIndex) => (
            <ChapterAccordion
              key={chapter.id}
              chapter={chapter}
              chapterIndex={chapterIndex}
              courseSlug={slug}
              isExpanded={expandedChapters.has(chapter.id)}
              onToggle={() => toggleChapter(chapter.id)}
            />
          ))}
      </div>
    </div>
  );
}
