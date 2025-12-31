/**
 * Empty Courses State Component
 * Displayed when user has no enrolled courses
 */

import { BookIcon } from "@/lib";

export function EmptyCoursesState() {
    return (
        <div className="border border-gray-200 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookIcon />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No Courses Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You haven&apos;t been enrolled in any courses yet. Contact us via WhatsApp to request enrollment.
            </p>
            <a
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
                Contact via WhatsApp
            </a>
        </div>
    );
}
