import { notFound } from "next/navigation";
import { adminService } from "@/services";
import { LessonDetailClient } from "@/components/admin/components/courses/lessons";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { id, lessonId } = await params;
  const courseId = parseInt(id, 10);
  const lessonIdNum = parseInt(lessonId, 10);

  if (isNaN(courseId) || isNaN(lessonIdNum)) {
    notFound();
  }

  const lesson = await adminService.getLesson(lessonIdNum);

  if (!lesson || lesson.chapter.course.id !== courseId) {
    notFound();
  }

  // Get playback token if lesson has video
  let playbackToken: string | null = null;
  if (lesson.muxPlaybackId && lesson.muxStatus === 'ready') {
    try {
      const signedUrls = await adminService.getLessonSignedUrls(lessonIdNum);
      playbackToken = signedUrls.playbackToken;
    } catch {
      // Ignore - will play without token
    }
  }

  return <LessonDetailClient lesson={lesson} playbackToken={playbackToken} />;
}
