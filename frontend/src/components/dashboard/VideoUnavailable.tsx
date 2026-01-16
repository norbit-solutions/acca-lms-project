import Link from "next/link";
import { LockIcon } from "@/lib/icons";

interface VideoUnavailableProps {
    slug: string;
}

export function VideoUnavailable({ slug }: VideoUnavailableProps) {
    return (
        <div className="w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <LockIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Video Unavailable
                </h3>
                <p className="text-[#333c8a] mb-8 max-w-md mx-auto">
                    This video lesson is not available for watching at the moment.
                    Please check back later or contact support if you believe this is an error.
                </p>
                <Link
                    href={`/dashboard/courses/${slug}`}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-[#333c8a] bg-white hover:bg-gray-50 transition-colors"
                >
                    Back to Course
                </Link>
            </div>
        </div>
    );
}
