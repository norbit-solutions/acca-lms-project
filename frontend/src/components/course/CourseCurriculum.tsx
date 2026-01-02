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
      console.log('Failed to load video preview:', error);
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
    <div
      className="lg:col-span-2"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-medium mb-4">About this Course</h2>
      <p className="text-gray-600 mb-12 leading-relaxed">
        {description || shortIntroduction}
      </p>

      <h2 className="text-2xl font-medium mb-6">Curriculum</h2>
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="bg-gray-50 px-5 py-4 flex justify-between items-center">
              <span className="font-medium text-gray-900">{chapter.title}</span>
              <span className="text-xs text-gray-500">
                {chapter.lessons.length} lessons
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`px-5 py-3.5 flex items-center justify-between ${lesson.isFree
                    ? 'cursor-pointer hover:bg-gray-50 transition-colors'
                    : ''
                    }`}
                  onClick={() => lesson.isFree && handlePlayFreeLesson(lesson)}
                >
                  <div className="flex items-center gap-3">
                    {lesson.isFree ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    <span className={`text-sm ${lesson.isFree ? 'text-gray-900' : 'text-gray-500'}`}>
                      {lesson.title}
                    </span>
                    {lesson.isFree && (
                      <span className="text-[10px] font-medium uppercase tracking-wide text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        Free
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
