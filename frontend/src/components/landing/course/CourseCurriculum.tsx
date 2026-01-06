"use client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

interface Lesson {
  id: number;
  title: string;
  duration: number;
  isFree?: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseCurriculumProps {
  chapters: Chapter[];
  description?: string;
}

export default function CourseCurriculum({
  chapters,
  description,
}: CourseCurriculumProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set([chapters[0]?.id])
  );
  const [playingLesson, setPlayingLesson] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const handlePlayFreeLesson = async (lesson: Lesson) => {
    setLoading(true);
    setPlayingLesson({ id: lesson.id, title: lesson.title });

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
      const res = await fetch(`${apiUrl}/public/lessons/${lesson.id}/preview`);
      if (!res.ok) throw new Error("Failed to get preview");
      const data = await res.json();
      setPlaybackId(data.playbackId);
      setPlaybackToken(data.playbackToken);
    } catch (error) {
      console.log("Failed to load video preview:", error);
      setPlayingLesson(null);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setPlayingLesson(null);
    setPlaybackId(null);
    setPlaybackToken(null);
  };

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const totalDuration = chapters.reduce(
    (acc, ch) =>
      acc + ch.lessons.reduce((lessonAcc, l) => lessonAcc + l.duration, 0),
    0
  );

  return (
    <div className="w-full" data-aos="fade-up">
      {/* About Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-display font-medium mb-6">
          About this Course
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>

      {/* Curriculum Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-display font-medium">Curriculum</h2>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {chapters.length} chapters
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {totalLessons} lessons
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {Math.round(totalDuration / 60)} min total
            </span>
          </div>
        </div>

        {/* Accordion Chapters */}
        <div className="space-y-4">
          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const chapterDuration = chapter.lessons.reduce(
              (acc, l) => acc + l.duration,
              0
            );

            return (
              <div
                key={chapter.id}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
              >
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900 text-left">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden sm:block">
                      {chapter.lessons.length} lessons •{" "}
                      {Math.round(chapterDuration / 60)} min
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Lessons List */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[1000px]" : "max-h-0"
                  }`}
                >
                  <div className="border-t border-gray-100">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className={`px-6 py-4 flex items-center justify-between ${
                          lesson.isFree
                            ? "cursor-pointer hover:bg-gray-50"
                            : "opacity-70"
                        } ${
                          lessonIndex !== chapter.lessons.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                        onClick={() =>
                          lesson.isFree && handlePlayFreeLesson(lesson)
                        }
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            {lesson.isFree ? (
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`text-sm ${
                                lesson.isFree
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {lesson.title}
                            </span>
                            {lesson.isFree && (
                              <span className="text-xs text-green-600 font-medium">
                                Free Preview
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round(lesson.duration / 60)} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Preview Modal */}
      {playingLesson && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-black rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">{playingLesson.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              {loading ? (
                <div className="text-white">Loading...</div>
              ) : playbackId && playbackToken ? (
                <MuxPlayer
                  playbackId={playbackId}
                  tokens={{ playback: playbackToken }}
                  autoPlay
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <div className="text-gray-400">Video unavailable</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
