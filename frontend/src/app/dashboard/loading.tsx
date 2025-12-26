export default function DashboardLoading() {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="h-7 w-40 bg-neutral-100 rounded animate-pulse mb-1" />
                <div className="h-4 w-56 bg-neutral-100 rounded animate-pulse" />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-12 pb-8 border-b border-neutral-100">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <div className="h-9 w-16 bg-neutral-100 rounded animate-pulse" />
                        <div className="h-3 w-20 bg-neutral-100 rounded animate-pulse mt-1" />
                    </div>
                ))}
            </div>

            {/* Recently Watched Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse" />
                <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
            </div>

            {/* Recent Lessons Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                        <div className="w-20 h-14 bg-neutral-100 rounded-lg animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-neutral-100 rounded w-48 animate-pulse" />
                            <div className="h-3 bg-neutral-100 rounded w-32 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
