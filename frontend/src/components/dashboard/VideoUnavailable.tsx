/**
 * Video Unavailable Component
 * Displayed when video is not ready yet
 */

import Link from "next/link";

interface VideoUnavailableProps {
    slug: string;
}

export function VideoUnavailable({ slug }: VideoUnavailableProps) {
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
