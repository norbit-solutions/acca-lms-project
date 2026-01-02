import { SearchIcon, CloseIcon } from "@/lib/icons";

interface UsersSearchProps {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearch: () => void;
    onClearSearch: () => void;
    searchMode: boolean;
}

export default function UsersSearch({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    onClearSearch,
    searchMode,
}: UsersSearchProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onSearch();
                            }
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all text-sm"
                        placeholder="Search by name, email, or phone..."
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onSearch}
                        className="px-6 py-3 bg-slate-100 text-slate-900 rounded-full font-medium hover:bg-slate-200 transition-all text-sm"
                    >
                        Search
                    </button>
                    {searchMode && (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            <CloseIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                    )}
                </div>
            </div>
            {searchMode && (
                <p className="mt-3 text-sm text-slate-500">
                    Showing search results for &quot;
                    <span className="font-semibold text-slate-700">{searchQuery}</span>
                    &quot;
                </p>
            )}
        </div>
    );
}
