"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminChapter, AdminCourseDetail, AdminLesson } from "@/types";
import { PlusIcon } from "@/lib/icons";
import {
  CourseDetailHeader,
  ChapterItem,
  ChapterModal,
  LessonModal,
  EmptyChaptersState,
} from "./courses/course-details";

interface CourseDetailClientProps {
  course: AdminCourseDetail; // renamed from initialCourse - used directly, not copied to state
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const router = useRouter();

  // UI-only state (not derived from props)
  const [processingLessons, setProcessingLessons] = useState<Set<number>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    () => new Set(course.chapters.map((c) => c.id))
  );

  // Modal state
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<AdminChapter | null>(null);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  // Subscribe to SSE for real-time lesson updates
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    const eventSource = new EventSource(`${apiUrl}/sse/course/${course.id}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'lesson:updated') {
          // Remove from processing set
          setProcessingLessons((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.lessonId);
            return newSet;
          });
          router.refresh();
        }
      } catch (error) {
        console.log('[SSE] Failed to parse message:', error);
      }
    };

    return () => eventSource.close();
  }, [course.id, router]);

  // Chapter handlers
  const toggleChapter = (id: number) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openNewChapterModal = () => {
    setEditingChapter(null);
    setShowChapterModal(true);
  };

  const openEditChapterModal = (chapter: AdminChapter) => {
    setEditingChapter(chapter);
    setShowChapterModal(true);
  };

  // Lesson handlers
  const openNewLessonModal = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setEditingLesson(null);
    setShowLessonModal(true);
  };

  const openEditLessonModal = (lesson: AdminLesson) => {
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  // Processing state handler (called from LessonItem after upload starts)
  const handleProcessingChange = (lessonId: number, isProcessing: boolean) => {
    setProcessingLessons((prev) => {
      const newSet = new Set(prev);
      if (isProcessing) {
        newSet.add(lessonId);
      } else {
        newSet.delete(lessonId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <CourseDetailHeader course={course} />

      {/* Course Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-slate-900">Course Content</h2>
            <p className="text-sm text-slate-500">
              {course.chapters.length} chapters, {course.chapters.reduce((acc, c) => acc + c.lessons.length, 0)} lessons
            </p>
          </div>
          <button
            onClick={openNewChapterModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            Add Chapter
          </button>
        </div>

        {course.chapters.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {course.chapters
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((chapter, chapterIndex) => (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  chapterIndex={chapterIndex}
                  courseId={course.id}
                  isExpanded={expandedChapters.has(chapter.id)}
                  processingLessons={processingLessons}
                  onToggle={() => toggleChapter(chapter.id)}
                  onEdit={() => openEditChapterModal(chapter)}
                  onAddLesson={() => openNewLessonModal(chapter.id)}
                  onEditLesson={openEditLessonModal}
                  onProcessingChange={handleProcessingChange}
                />
              ))}
          </div>
        ) : (
          <EmptyChaptersState onAddChapter={openNewChapterModal} />
        )}
      </div>

      {/* Modals */}
      <ChapterModal
        isOpen={showChapterModal}
        editingChapter={editingChapter}
        courseId={course.id}
        onClose={() => setShowChapterModal(false)}
      />

      <LessonModal
        isOpen={showLessonModal}
        editingLesson={editingLesson}
        chapterId={selectedChapterId}
        onClose={() => setShowLessonModal(false)}
      />
    </div>
  );
}
