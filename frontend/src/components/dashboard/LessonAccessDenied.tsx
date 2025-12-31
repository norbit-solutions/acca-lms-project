/**
 * Lesson Access Denied Component
 * Displayed when user has reached view limit
 */

import Link from "next/link";
import { LockIcon } from "@/lib";

interface LessonAccessDeniedProps {
    slug: string;
    viewCount: number;
    maxViews: number;
}

export function LessonAccessDenied({ slug, viewCount, maxViews }: LessonAccessDeniedProps) {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockIcon className="w-6 h-6 text-gray-500" />
                </div>
                <h2 className="text-xl font-medium text-black mb-2">Access Denied</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    You have reached the maximum view limit for this lesson ({viewCount}/{maxViews} views used).
                </p>
                <Link
                    href={`/dashboard/courses/${slug}`}
                    className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Back to Course
                </Link>
            </div>
        </div>
    );
}
