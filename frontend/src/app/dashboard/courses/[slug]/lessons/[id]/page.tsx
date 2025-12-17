"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { studentService } from "@/services";
import VideoPlayer from "@/components/dashboard/VideoPlayer";
import type { LessonDetail } from "@/types";

// Icons
const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export default function LessonPlayerPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = parseInt(params?.id as string);
    const slug = params?.slug as string;

    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                setIsLoading(true);
                const data = await studentService.getLesson(lessonId);
                setLesson(data);
            } catch (err: any) {
                console.error("Failed to fetch lesson:", err);
                setError(err.response?.data?.message || "Failed to load lesson");
            } finally {
                setIsLoading(false);
            }
        };

        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId]);

    const handleViewStart = async (watchPercentage: number) => {
        try {
            await studentService.startView(lessonId, watchPercentage);
            console.log(`View tracking updated at ${watchPercentage}%`);
        } catch (err) {
            console.error("Failed to update view tracking:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/4" />
                    <div className="aspect-video bg-slate-200 rounded-2xl" />
                    <div className="h-32 bg-slate-200 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium mb-4">{error || "Lesson not found"}</p>
                    <Link
                        href={`/dashboard/courses/${slug}`}
                        className="inline-block text-violet-600 hover:text-violet-700 font-medium"
                    >
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    // Check if user can watch
    if (!lesson.canWatch) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <LockIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Access Denied</h2>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        You have reached the maximum view limit for this lesson ({lesson.viewCount}/{lesson.maxViews} views used).
                    </p>
                    <Link
                        href={`/dashboard/courses/${slug}`}
                        className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors"
                    >
                        <BackIcon />
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    // Check if video is available
    if (!lesson.playbackId) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                    <p className="text-amber-600 font-medium mb-4">Video is not available yet</p>
                    <Link
                        href={`/dashboard/courses/${slug}`}
                        className="inline-block text-violet-600 hover:text-violet-700 font-medium"
                    >
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    // Extract token from signed URL if present
    const extractTokenFromUrl = (signedUrl: string | null): string | null => {
        if (!signedUrl) return null;
        try {
            const url = new URL(signedUrl);
            return url.searchParams.get('token');
        } catch {
            return null;
        }
    };

    const playbackToken = extractTokenFromUrl(lesson.signedUrl);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.push(`/dashboard/courses/${slug}`)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors group"
            >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <BackIcon />
                </div>
                <span>Back to {lesson.course.title}</span>
            </button>

            {/* Video Player */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <VideoPlayer
                    playbackId={lesson.playbackId}
                    playbackToken={playbackToken}
                    watermarkText={lesson.watermark.text}
                    watermarkPhone={lesson.watermark.phone}
                    title={lesson.title}
                    onViewStart={handleViewStart}
                />
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-sm text-slate-500 mb-2">
                            {lesson.chapter.title}
                        </p>
                        <h1 className="text-2xl font-display font-bold text-slate-900 mb-3">
                            {lesson.title}
                        </h1>
                    </div>
                </div>

                {/* View Stats */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                        <EyeIcon />
                        <div>
                            <p className="text-sm text-slate-500">Views Used</p>
                            <p className="font-bold text-slate-900">
                                {lesson.viewCount} / {lesson.maxViews}
                            </p>
                        </div>
                    </div>

                    {lesson.duration && (
                        <div className="pl-6 border-l border-slate-200">
                            <p className="text-sm text-slate-500">Duration</p>
                            <p className="font-bold text-slate-900">
                                {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                            </p>
                        </div>
                    )}

                    <div className="ml-auto">
                        <div className={`px-4 py-2 rounded-lg font-medium text-sm ${lesson.viewCount >= lesson.maxViews
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                            }`}>
                            {lesson.viewCount >= lesson.maxViews
                                ? "View Limit Reached"
                                : `${lesson.maxViews - lesson.viewCount} views remaining`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Attachments - Coming Soon (if needed) */}
            {/* This can be added later if lessons have downloadable materials */}
        </div>
    );
}
