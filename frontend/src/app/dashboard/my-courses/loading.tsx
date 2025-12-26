export default function MyCoursesLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="h-10 w-48 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-5 w-72 bg-slate-200 rounded animate-pulse" />
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                        <div className="h-48 bg-slate-200" />
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-slate-200 rounded w-3/4" />
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 rounded w-full" />
                                <div className="h-2 bg-slate-200 rounded-full" />
                            </div>
                            <div className="h-10 bg-slate-200 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
