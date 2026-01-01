"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { studentService } from "@/services";
import { BackIcon, extractTokenFromUrl, formatDuration } from "@/lib";
import VideoPlayer from "@/components/dashboard/VideoPlayer";
import type { LessonDetail } from "@/types";
import { VideoUnavailable } from "./VideoUnavailable";

interface LessonPlayerClientProps {
    lesson: LessonDetail;
    slug: string;
}

// Helper to get icon for document type
function getDocumentIcon(type: string) {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation') || type.includes('ppt')) return '📽️';
    if (type.includes('text') || type.includes('txt')) return '📃';
    return '📎';
}

// Helper to get file extension from MIME type
function getFileExtension(type: string): string {
    const ext = type.split('/').pop() || 'file';
    return ext
        .replace('vnd.openxmlformats-officedocument.', '')
        .replace('wordprocessingml.document', 'docx')
        .replace('spreadsheetml.sheet', 'xlsx')
        .replace('presentationml.presentation', 'pptx');
}

export default function LessonPlayerClient({ lesson, slug }: LessonPlayerClientProps) {
    const router = useRouter();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const viewsRemaining = lesson.maxViews - lesson.viewCount;
    const viewsPercentage = (lesson.viewCount / lesson.maxViews) * 100;
    const hasAttachments = lesson.attachments && lesson.attachments.length > 0;
    const hasLongDescription = lesson.description && lesson.description.length > 150;

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
        <div className="w-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={() => router.push(`/dashboard/courses/${slug}`)}
                    className="group flex items-center gap-2 text-gray-500 hover:text-black text-sm transition-all"
                >
                    <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <BackIcon className="w-4 h-4" />
                    </span>
                    <span className="font-medium hidden md:block">{lesson.course.title}</span>
                </button>

                {/* Progress Indicator */}
                {
                    lesson.playbackId &&
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                            <span>{lesson.viewCount} of {lesson.maxViews} views used</span>
                        </div>
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${viewsPercentage >= 100 ? 'bg-red-500' :
                                    viewsPercentage >= 80 ? 'bg-amber-500' : 'bg-black'
                                    }`}
                                style={{ width: `${Math.min(viewsPercentage, 100)}%` }}
                            />
                        </div>
                    </div>
                }
            </div>

            {
                lesson.playbackId && (

                    < div className="relative mb-6">
                        <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
                            <VideoPlayer
                                playbackId={lesson.playbackId!}
                                playbackToken={playbackToken}
                                watermarkText={lesson.watermark.text}
                                watermarkPhone={lesson.watermark.phone}
                                title={lesson.title}
                                onViewStart={handleViewStart}
                            />
                        </div>
                    </div>
                )
            }



            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Title & Description Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                                {/* Chapter Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-3">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                    </svg>
                                    {lesson.chapter.title}
                                </div>

                                {/* Title */}
                                <h1 className="text-xl font-bold text-black mb-3 leading-tight">
                                    {lesson.title}
                                </h1>

                                {/* Description */}
                                {lesson.description && (
                                    <div className="relative">
                                        <p className={`text-sm text-gray-600 leading-relaxed ${!showFullDescription && hasLongDescription ? 'line-clamp-3' : ''
                                            }`}>
                                            {lesson.description}
                                        </p>
                                        {hasLongDescription && (
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="text-sm font-medium text-black hover:underline mt-1"
                                            >
                                                {showFullDescription ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        {lesson.playbackId && (
                            <div className="flex items-center gap-5 mt-5 pt-5 border-t border-gray-100">
                                {lesson.duration && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-black">{formatDuration(lesson.duration)}</p>
                                            <p className="text-xs text-gray-500">Duration</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${viewsRemaining === 0 ? 'bg-red-100' :
                                        viewsRemaining === 1 ? 'bg-amber-100' : 'bg-gray-100'
                                        }`}>
                                        <svg className={`w-4 h-4 ${viewsRemaining === 0 ? 'text-red-600' :
                                            viewsRemaining === 1 ? 'text-amber-600' : 'text-gray-600'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-black">{viewsRemaining} remaining</p>
                                        <p className="text-xs text-gray-500">{lesson.viewCount}/{lesson.maxViews} used</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Study Materials */}
                    {hasAttachments && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-black mb-4">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Study Materials
                            </h3>
                            <div className="space-y-2">
                                {lesson.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                                    >
                                        <span className="text-2xl">{getDocumentIcon(attachment.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-black truncate group-hover:underline">
                                                {attachment.name}
                                            </p>
                                            <p className="text-xs text-gray-500 uppercase">
                                                {getFileExtension(attachment.type)}
                                            </p>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-black mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href={`/dashboard/courses/${slug}`}
                                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-100 rounded-xl transition-all group text-sm text-gray-700 hover:text-black"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                <span>View all lessons</span>
                            </Link>
                            {/* <Link
                                href="/dashboard"
                                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-100 rounded-xl transition-all group text-sm text-gray-700 hover:text-black"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Back to dashboard</span>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
