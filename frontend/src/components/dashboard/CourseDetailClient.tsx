"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BackIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    PlayCircleIcon,
    LockIcon,
    CheckCircleIcon,
    formatDuration,
} from "@/lib";
import type { CourseWithProgress } from "@/types";

interface CourseDetailClientProps {
    course: CourseWithProgress;
    slug: string;
}

export default function CourseDetailClient({ course, slug }: CourseDetailClientProps) {
    const router = useRouter();
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

    const formatLessonDuration = (seconds: number | null) => {
        if (!seconds) return "--:--";
        return formatDuration(seconds);
    };

    // Calculate total duration
    const totalDuration = course.chapters.reduce(
        (total, chapter) => total + chapter.lessons.reduce(
            (chTotal, lesson) => chTotal + (lesson.duration || 0), 0
        ), 0
    );

    return (
        <div className="w-full">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-black text-sm transition-colors"
                >
                    <BackIcon className="w-4 h-4" />
                    <span>Dashboard</span>
                </button>
            </div>

            {/* Course Info Card */}
            <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                    {/* Small Thumbnail */}
                    {course.thumbnail && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-semibold text-black mb-1 truncate">
                            {course.title}
                        </h1>
                        {course.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {course.description}
                            </p>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {course.chapters.length} chapters
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {course.progress.total} lessons
                            </span>
                            {totalDuration > 0 && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDuration(totalDuration)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-black">
                            {course.progress.completed} of {course.progress.total} complete
                        </span>
                        <span className="text-sm font-bold text-black">
                            {Math.round(course.progress.percentage)}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-300"
                            style={{ width: `${course.progress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className="space-y-2">
                {course.chapters
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((chapter, chapterIndex) => {
                        const completedInChapter = chapter.lessons.filter(l => l.isCompleted).length;
                        const totalInChapter = chapter.lessons.length;

                        return (
                            <div key={chapter.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                {/* Chapter Header */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                            {chapterIndex + 1}
                                        </span>
                                        <div className="text-left">
                                            <p className="font-medium text-black text-sm">
                                                {chapter.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {completedInChapter}/{totalInChapter} lessons
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {completedInChapter === totalInChapter && totalInChapter > 0 && (
                                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                Complete
                                            </span>
                                        )}
                                        <span className="text-gray-400">
                                            {expandedChapters.has(chapter.id) ? (
                                                <ChevronDownIcon className="w-4 h-4" />
                                            ) : (
                                                <ChevronRightIcon className="w-4 h-4" />
                                            )}
                                        </span>
                                    </div>
                                </button>

                                {/* Lessons */}
                                {expandedChapters.has(chapter.id) && (
                                    <div className="border-t border-gray-100 bg-gray-50/50">
                                        {chapter.lessons
                                            .sort((a, b) => a.sortOrder - b.sortOrder)
                                            .map((lesson, lessonIndex) => (
                                                <div key={lesson.id} className="border-b border-gray-100 last:border-0">
                                                    {lesson.canWatch ? (
                                                        <Link
                                                            href={`/dashboard/courses/${slug}/lessons/${lesson.id}`}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors group"
                                                        >
                                                            {/* Status Icon */}
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.isCompleted
                                                                ? 'bg-black text-white'
                                                                : 'border-2 border-gray-300 group-hover:border-black'
                                                                }`}>
                                                                {lesson.isCompleted ? (
                                                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <PlayCircleIcon className="w-3 h-3 text-gray-400 group-hover:text-black" />
                                                                )}
                                                            </div>

                                                            {/* Lesson Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-black group-hover:underline truncate">
                                                                    {lessonIndex + 1}. {lesson.title}
                                                                </p>
                                                            </div>

                                                            {/* Duration & Views */}
                                                            <div className="flex items-center gap-3 text-xs text-gray-400 flex-shrink-0">
                                                                <span>{formatLessonDuration(lesson.duration)}</span>
                                                                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                                                                    {lesson.viewCount}/{lesson.maxViews}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <div className="flex items-center gap-3 px-4 py-3 opacity-50">
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                                <LockIcon className="w-3 h-3 text-gray-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm text-gray-500 truncate">
                                                                    {lessonIndex + 1}. {lesson.title}
                                                                </p>
                                                            </div>
                                                            <span className="text-xs text-gray-400 flex-shrink-0">
                                                                View limit reached
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
