/**
 * Lesson Info Component
 * Displays lesson details and view statistics
 */

import { formatDuration } from "@/lib";
import type { LessonDetail } from "@/types";

interface LessonInfoProps {
    lesson: LessonDetail;
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

export function LessonInfo({ lesson }: LessonInfoProps) {
    const viewsRemaining = lesson.maxViews - lesson.viewCount;
    const hasAttachments = lesson.attachments && lesson.attachments.length > 0;

    return (
        <div className="space-y-4">
            {/* Lesson Info */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">{lesson.chapter.title}</p>
                    <h1 className="text-xl font-medium text-black">
                        {lesson.title}
                    </h1>
                    {lesson.description && (
                        <p className="text-sm text-gray-600 mt-2">
                            {lesson.description}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-2xl font-light text-black">
                            {lesson.viewCount}/{lesson.maxViews}
                        </p>
                        <p className="text-xs text-gray-500">views used</p>
                    </div>

                    {lesson.duration && (
                        <div>
                            <p className="text-2xl font-light text-black">
                                {formatDuration(lesson.duration)}
                            </p>
                            <p className="text-xs text-gray-500">duration</p>
                        </div>
                    )}

                    <div className="ml-auto text-right">
                        <p className={`text-sm font-medium ${viewsRemaining > 0 ? "text-black" : "text-gray-500"}`}>
                            {viewsRemaining > 0 ? `${viewsRemaining} views remaining` : "View limit reached"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Study Materials */}
            {hasAttachments && (
                <div className="border border-gray-200 rounded-lg p-6">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                        Study Materials
                    </h2>
                    <div className="space-y-2">
                        {lesson.attachments.map((attachment, index) => (
                            <a
                                key={index}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                            >
                                <span className="text-xl">{getDocumentIcon(attachment.type)}</span>
                                <span className="flex-1 text-sm font-medium text-gray-900 group-hover:text-black">
                                    {attachment.name}
                                </span>
                                <span className="text-xs text-gray-400 uppercase">
                                    {attachment.type.split('/').pop()?.replace('vnd.openxmlformats-officedocument.', '').replace('wordprocessingml.document', 'docx').replace('spreadsheetml.sheet', 'xlsx').replace('presentationml.presentation', 'pptx') || 'file'}
                                </span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
