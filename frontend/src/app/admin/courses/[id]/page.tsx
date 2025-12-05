"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

interface Lesson {
  id: number;
  title: string;
  sortOrder: number;
  isFree: boolean;
  maxViews: number;
  muxAssetId: string | null;
  muxPlaybackId: string | null;
  duration: number | null;
}

interface Chapter {
  id: number;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  isPublished: boolean;
  chapters: Chapter[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set()
  );

  // Modal states
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  const [chapterForm, setChapterForm] = useState({ title: "" });
  const [lessonForm, setLessonForm] = useState({
    title: "",
    isFree: false,
    maxViews: 2,
  });

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const { data } = await adminApi.getCourse(courseId);
      setCourse(data);
      // Expand all chapters by default
      setExpandedChapters(new Set(data.chapters.map((c: Chapter) => c.id)));
    } catch (error) {
      console.error("Failed to load course:", error);
      router.push("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (id: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedChapters(newExpanded);
  };

  // Chapter handlers
  const openNewChapterModal = () => {
    setEditingChapter(null);
    setChapterForm({ title: "" });
    setShowChapterModal(true);
  };

  const openEditChapterModal = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterForm({ title: chapter.title });
    setShowChapterModal(true);
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChapter) {
        await adminApi.updateChapter(editingChapter.id, chapterForm);
      } else {
        await adminApi.createChapter(courseId, chapterForm);
      }
      setShowChapterModal(false);
      loadCourse();
    } catch (error) {
      console.error("Failed to save chapter:", error);
      alert("Failed to save chapter");
    }
  };

  const handleDeleteChapter = async (chapter: Chapter) => {
    if (!confirm(`Delete "${chapter.title}" and all its lessons?`)) return;
    try {
      await adminApi.deleteChapter(chapter.id);
      loadCourse();
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      alert("Failed to delete chapter");
    }
  };

  // Lesson handlers
  const openNewLessonModal = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setEditingLesson(null);
    setLessonForm({ title: "", isFree: false, maxViews: 2 });
    setShowLessonModal(true);
  };

  const openEditLessonModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      isFree: lesson.isFree,
      maxViews: lesson.maxViews,
    });
    setShowLessonModal(true);
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await adminApi.updateLesson(editingLesson.id, lessonForm);
      } else if (selectedChapterId) {
        await adminApi.createLesson(selectedChapterId, lessonForm);
      }
      setShowLessonModal(false);
      loadCourse();
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert("Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!confirm(`Delete "${lesson.title}"?`)) return;
    try {
      await adminApi.deleteLesson(lesson.id);
      loadCourse();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      alert("Failed to delete lesson");
    }
  };

  const handleUploadVideo = async (lessonId: number) => {
    try {
      const { data } = await adminApi.getLessonUploadUrl(lessonId);
      // Open Mux uploader in new window or show upload UI
      // For now, just show the upload URL
      alert(
        `Upload URL: ${data.uploadUrl}\n\nNote: Video upload UI will be implemented with Mux integration.`
      );
    } catch (error) {
      console.error("Failed to get upload URL:", error);
      alert("Failed to get upload URL");
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/admin/courses")}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            ← Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-500 mt-1">
            {course.description || "No description"}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.isPublished
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {course.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Chapters */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Course Content
          </h2>
          <button
            onClick={openNewChapterModal}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Chapter
          </button>
        </div>

        {course.chapters.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {course.chapters
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((chapter, chapterIndex) => (
                <div key={chapter.id}>
                  {/* Chapter Header */}
                  <div
                    className="px-6 py-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-gray-400">
                        {expandedChapters.has(chapter.id) ? "▼" : "▶"}
                      </span>
                      <span className="font-medium text-gray-900">
                        Chapter {chapterIndex + 1}: {chapter.title}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        ({chapter.lessons.length} lessons)
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openNewLessonModal(chapter.id)}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        + Lesson
                      </button>
                      <button
                        onClick={() => openEditChapterModal(chapter)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(chapter)}
                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Lessons */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="bg-white">
                      {chapter.lessons.length > 0 ? (
                        chapter.lessons
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="px-6 py-3 pl-14 flex items-center justify-between border-t border-gray-50 hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 mr-3">
                                  {lessonIndex + 1}
                                </span>
                                <span className="text-gray-900">
                                  {lesson.title}
                                </span>
                                {lesson.isFree && (
                                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                    Free
                                  </span>
                                )}
                                <span className="ml-2 text-sm text-gray-400">
                                  {formatDuration(lesson.duration)}
                                </span>
                                {lesson.muxPlaybackId ? (
                                  <span className="ml-2 text-green-500 text-xs">
                                    ✓ Video
                                  </span>
                                ) : (
                                  <span className="ml-2 text-yellow-500 text-xs">
                                    ⚠ No video
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleUploadVideo(lesson.id)}
                                  className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
                                >
                                  {lesson.muxPlaybackId
                                    ? "Replace Video"
                                    : "Upload Video"}
                                </button>
                                <button
                                  onClick={() => openEditLessonModal(lesson)}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(lesson)}
                                  className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="px-6 py-4 pl-14 text-gray-400 text-sm">
                          No lessons yet.{" "}
                          <button
                            onClick={() => openNewLessonModal(chapter.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Add one
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="text-4xl mb-4 block">📖</span>
            <p className="text-gray-500 mb-4">No chapters yet</p>
            <button
              onClick={openNewChapterModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Chapter
            </button>
          </div>
        )}
      </div>

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingChapter ? "Edit Chapter" : "New Chapter"}
            </h2>
            <form onSubmit={handleChapterSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Introduction to Financial Reporting"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingChapter ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingLesson ? "Edit Lesson" : "New Lesson"}
            </h2>
            <form onSubmit={handleLessonSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Understanding Balance Sheets"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Views
                  </label>
                  <input
                    type="number"
                    value={lessonForm.maxViews}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        maxViews: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={1}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of times a student can view this lesson
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={lessonForm.isFree}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, isFree: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isFree"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Free preview (visible without enrollment)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingLesson ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
