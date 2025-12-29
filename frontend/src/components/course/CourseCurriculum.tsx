"use client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

interface Lesson {
  id: number;
  title: string;
  duration: number; // in seconds
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
  shortIntroduction?: string;
}

export default function CourseCurriculum({
  chapters,
  description,
  shortIntroduction,
}: CourseCurriculumProps) {
  const [playingLesson, setPlayingLesson] = useState<{ id: number; title: string } | null>(null);
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlayFreeLesson = async (lesson: Lesson) => {
    setLoading(true);
    setPlayingLesson({ id: lesson.id, title: lesson.title });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/public/lessons/${lesson.id}/preview`);
      if (!res.ok) throw new Error('Failed to get preview');
      const data = await res.json();
      setPlaybackId(data.playbackId);
      setPlaybackToken(data.playbackToken);
    } catch (error) {
      console.error('Failed to load video preview:', error);
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

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-6">About this Course</h2>
      <div className="prose max-w-none text-gray-600 mb-12">
        {description || shortIntroduction}
      </div>

      <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 font-bold flex justify-between items-center">
              <span>{chapter.title}</span>
              <span className="text-sm text-gray-500 font-normal">
                {chapter.lessons.length} Lessons
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`px-6 py-3 flex items-center justify-between transition-colors ${lesson.isFree ? 'hover:bg-blue-50 cursor-pointer' : 'hover:bg-gray-50'
                    }`}
                  onClick={() => lesson.isFree && handlePlayFreeLesson(lesson)}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-4 h-4 ${lesson.isFree ? 'text-blue-500' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className={lesson.isFree ? 'text-gray-900' : 'text-gray-700'}>{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Free Preview
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(lesson.duration / 60)} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  style={{ width: '100%', height: '100%' }}
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
