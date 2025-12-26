export default function ProfileLoading() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
            {/* Header */}
            <div>
                <div className="h-9 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-5 w-80 bg-slate-200 rounded" />
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-32 bg-slate-100" />
                <div className="px-8 pb-8">
                    <div className="flex items-end gap-6 -mt-16 mb-6">
                        <div className="w-32 h-32 bg-slate-300 rounded-2xl" />
                        <div className="pb-2">
                            <div className="h-7 w-40 bg-slate-200 rounded mb-2" />
                            <div className="h-4 w-20 bg-slate-200 rounded" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="h-20 bg-slate-50 rounded-xl" />
                        <div className="h-20 bg-slate-50 rounded-xl" />
                    </div>
                    <div className="h-44 bg-slate-50 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
