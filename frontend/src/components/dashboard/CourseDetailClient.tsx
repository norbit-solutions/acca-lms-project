"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CourseWithProgress } from "@/types";

// Icons
const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const PlayIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

interface CourseDetailClientProps {
    course: CourseWithProgress;
    slug: string;
}

export default function CourseDetailClient({ course, slug }: CourseDetailClientProps) {
    const router = useRouter();
    // Initialize with all chapters expanded
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

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors group"
            >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <BackIcon />
                </div>
                <span>Back to Dashboard</span>
            </button>

            {/* Course Header */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Thumbnail */}
                {course.thumbnail && (
                    <div className="h-64 bg-slate-100 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Course Info */}
                <div className="p-8">
                    <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">
                        {course.title}
                    </h1>
                    {course.description && (
                        <p className="text-slate-600 text-lg mb-6">{course.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="bg-slate-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-slate-600">
                                Your Progress
                            </span>
                            <span className="text-2xl font-bold text-slate-900">
                                {Math.round(course.progress.percentage)}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress.percentage}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500">
                            {course.progress.completed} of {course.progress.total} lessons completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100">
                    <h2 className="text-xl font-display font-bold text-slate-900">
                        Course Content
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {course.chapters.length} chapters • {course.progress.total} lessons
                    </p>
                </div>

                {/* Chapters & Lessons */}
                <div className="divide-y divide-slate-100">
                    {course.chapters
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((chapter, chapterIndex) => (
                            <div key={chapter.id}>
                                {/* Chapter Header */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full px-8 py-5 bg-slate-50/50 hover:bg-slate-100/50 flex items-center justify-between transition-colors text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-slate-400">
                                            {expandedChapters.has(chapter.id) ? (
                                                <ChevronDownIcon />
                                            ) : (
                                                <ChevronRightIcon />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Chapter {chapterIndex + 1}: {chapter.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {chapter.lessons.length} lessons
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                {/* Lessons */}
                                {expandedChapters.has(chapter.id) && (
                                    <div className="bg-white">
                                        {chapter.lessons
                                            .sort((a, b) => a.sortOrder - b.sortOrder)
                                            .map((lesson, lessonIndex) => (
                                                <div
                                                    key={lesson.id}
                                                    className="px-8 py-4 pl-20 border-t border-slate-50"
                                                >
                                                    {lesson.canWatch ? (
                                                        <Link
                                                            href={`/dashboard/courses/${slug}/lessons/${lesson.id}`}
                                                            className="flex items-center justify-between group hover:bg-slate-50 -mx-4 px-4 py-2 rounded-lg transition-colors"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                                                                    {lessonIndex + 1}
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <PlayIcon />
                                                                    <div>
                                                                        <p className="font-medium text-slate-900 group-hover:text-violet-600 transition-colors">
                                                                            {lesson.title}
                                                                        </p>
                                                                        <p className="text-sm text-slate-500">
                                                                            {formatDuration(lesson.duration)} •{" "}
                                                                            {lesson.viewCount}/{lesson.maxViews} views used
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {lesson.isCompleted && (
                                                                    <CheckCircleIcon />
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <div className="flex items-center justify-between opacity-60">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                                                                    {lessonIndex + 1}
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <LockIcon />
                                                                    <div>
                                                                        <p className="font-medium text-slate-600">
                                                                            {lesson.title}
                                                                        </p>
                                                                        <p className="text-sm text-red-600">
                                                                            View limit reached ({lesson.viewCount}/{lesson.maxViews})
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
