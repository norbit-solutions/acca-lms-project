"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLesson } from "@/types";
import { ArrowLeftIcon, BackIcon } from "@/lib/icons";
import LessonVideoPlayer from "./LessonVideoPlayer";
import LessonInfo from "./LessonInfo";
import LessonAttachments from "./LessonAttachments";
import { LessonModal } from "../course-details";

interface LessonDetailData extends AdminLesson {
  thumbnailUrl: string | null;
  chapter: {
    id: number;
    title: string;
    course: {
      id: number;
      title: string;
      slug: string;
    };
  };
}

interface LessonDetailClientProps {
  lesson: LessonDetailData;
  playbackToken: string | null;
}

export default function LessonDetailClient({ lesson, playbackToken }: LessonDetailClientProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleBack = () => {
    router.push(`/admin/courses/${lesson.chapter.course.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
                    >
                      <BackIcon className="w-5 h-5 text-slate-600" />
                    </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              {lesson.title}
            </h1>
            {/* <p className="text-sm text-slate-500">
              {lesson.chapter.course.title} → {lesson.chapter.title}
            </p> */}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player - Full width on mobile, 2 cols on desktop */}
        <div className="lg:col-span-2">
          {lesson.type === 'video' ? (
            <LessonVideoPlayer
              lessonId={lesson.id}
              playbackId={lesson.muxPlaybackId}
              playbackToken={playbackToken}
              muxStatus={lesson.muxStatus}
              muxUploadId={lesson.muxUploadId}
            />
          ) : lesson.type === 'pdf' ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="aspect-video bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">PDF</span>
                  </div>
                  <p className="text-slate-600">PDF Lesson</p>
                  {lesson.pdfUrl && (
                    <a
                      href={lesson.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Lesson Content</h3>
              <div className="prose prose-slate max-w-none">
                {lesson.content || <p className="text-slate-400 italic">No content</p>}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <LessonInfo
            title={lesson.title}
            description={lesson.description}
            type={lesson.type}
            duration={lesson.duration}
            viewLimit={lesson.viewLimit}
            isFree={lesson.isFree}
            chapterTitle={lesson.chapter.title}
            courseTitle={lesson.chapter.course.title}
            onEdit={() => setShowEditModal(true)}
          />

          <LessonAttachments attachments={lesson.attachments} />
        </div>
      </div>

      {/* Edit Modal */}
      <LessonModal
        isOpen={showEditModal}
        editingLesson={lesson}
        chapterId={lesson.chapter.id}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}
