/**
 * Lesson Loading Skeleton
 * Displayed while lesson data is being fetched
 */

export function LessonLoadingSkeleton() {
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
