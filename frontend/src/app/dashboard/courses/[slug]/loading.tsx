export default function CourseDetailLoading() {
    return (
        <div className="max-w-5xl mx-auto animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-6" />
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
                <div className="h-64 bg-slate-200" />
                <div className="p-8 space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="bg-slate-50 rounded-xl p-6">
                        <div className="h-6 bg-slate-200 rounded w-32 mb-3" />
                        <div className="h-3 bg-slate-200 rounded-full w-full mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-40" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100">
                    <div className="h-6 bg-slate-200 rounded w-40" />
                </div>
                <div className="p-4 space-y-4">
                    <div className="h-20 bg-slate-100 rounded-xl" />
                    <div className="h-20 bg-slate-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
