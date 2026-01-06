"use client";

import { studentService } from "@/services";
import { extractTokenFromUrl } from "@/lib";
import type { LessonDetail } from "@/types";
import {
  LessonTopBar,
  LessonVideoSection,
  LessonInfoCard,
  StudyMaterials,
  QuickActions,
} from "./components/lessons";

interface LessonPlayerClientProps {
  lesson: LessonDetail;
  slug: string;
}

export default function LessonPlayerClient({ lesson, slug }: LessonPlayerClientProps) {
  const hasVideo = !!lesson.playbackId;
  const hasAttachments = lesson.attachments && lesson.attachments.length > 0;

  const handleViewStart = async (watchPercentage: number) => {
    try {
      await studentService.startView(lesson.id, watchPercentage);
      console.log(`View tracking updated at ${watchPercentage}%`);
    } catch (err) {
      console.log("Failed to update view tracking:", err);
    }
  };

  const playbackToken = extractTokenFromUrl(lesson.signedUrl);

  return (
    <div className="w-full gap-5 flex flex-col">
      <LessonTopBar
        courseSlug={slug}
        lessonTitle={lesson.title}
        viewCount={lesson.viewCount}
        maxViews={lesson.maxViews}
        hasVideo={hasVideo}
      />

  <div className="flex flex-col lg:flex-row gap-5">
      {hasVideo && (
        <LessonVideoSection
          playbackId={lesson.playbackId!}
          playbackToken={playbackToken}
          watermarkPhone={lesson.watermark.phone}
          title={lesson.title}
          canWatch={lesson.canWatch}
          viewCount={lesson.viewCount}
          maxViews={lesson.maxViews}
          onViewStart={handleViewStart}
        />
        
      )}
       {hasAttachments && <StudyMaterials attachments={lesson.attachments} />}
      </div>

      {/* Content Grid */}
      <div className="w-full">
        {/* Main Content */}
        <div className="flex lg:flex-row flex-col gap-8">
          <LessonInfoCard
            description={lesson.description}
            chapterTitle={lesson.chapter.title}
            duration={lesson.duration}
            viewCount={lesson.viewCount}
            maxViews={lesson.maxViews}
            hasVideo={hasVideo}
          />
          <QuickActions courseSlug={slug} />
        </div>

      </div>
    </div>
  );
}
