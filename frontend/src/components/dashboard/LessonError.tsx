/**
 * Lesson Error State Component
 * Displayed when lesson fails to load
 */

import Link from "next/link";

interface LessonErrorProps {
    error: string | null;
    slug: string;
}

export function LessonError({ error, slug }: LessonErrorProps) {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">{error || "Lesson not found"}</p>
                <Link
                    href={`/dashboard/courses/${slug}`}
                    className="text-black hover:underline font-medium"
                >
                    Back to Course
                </Link>
            </div>
        </div>
    );
}
