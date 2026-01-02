import { User, AdminCourse } from "@/types";
import { SearchIcon, CloseIcon, CheckIcon, UserIcon } from "@/lib/icons";
import Modal from "@/components/modals/Modal";

interface NewEnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearch: () => void;
    searching: boolean;
    hasSearched: boolean;
    searchResults: User[];
    selectedUser: User | null;
    onSelectUser: (user: User | null) => void;
    courses: AdminCourse[];
    selectedCourses: Set<number>;
    onToggleCourse: (courseId: number) => void;
    onEnroll: () => void;
    enrolling: boolean;
}

export default function NewEnrollmentModal({
    isOpen,
    onClose,
    searchQuery,
    onSearchQueryChange,
    onSearch,
    searching,
    hasSearched,
    searchResults,
    selectedUser,
    onSelectUser,
    courses,
    selectedCourses,
    onToggleCourse,
    onEnroll,
    enrolling,
}: NewEnrollmentModalProps) {
    const enrollButtonLabel = enrolling
        ? "Enrolling..."
        : `Enroll in ${selectedCourses.size} Course${selectedCourses.size !== 1 ? "s" : ""}`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="New Enrollment"
            subtitle="Search for a student and select courses to enroll them in"
            size="md"
            buttons={[
                {
                    label: "Cancel",
                    onClick: onClose,
                    variant: "ghost",
                },
                {
                    label: enrollButtonLabel,
                    onClick: onEnroll,
                    variant: "primary",
                    isLoading: enrolling,
                    loadingText: "Enrolling...",
                    disabled: !selectedUser || selectedCourses.size === 0,
                },
            ]}
        >
            <div className="space-y-6">
                {/* Student Search Section */}
                <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                        Find Student
                    </label>

                    {/* Selected User Card */}
                    {selectedUser ? (
                        <div className="relative group">
                            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-lg font-semibold text-white shadow-lg">
                                        {selectedUser.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">
                                            {selectedUser.fullName}
                                        </p>
                                        <p className="text-sm text-slate-500 truncate">
                                            {selectedUser.email}
                                        </p>
                                        {selectedUser.phone && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {selectedUser.phone}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onSelectUser(null)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Remove selection"
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <span className="flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-white" />
                                    </span>
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* Search Input */
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <SearchIcon className="w-4 h-4" />
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
                                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                                        placeholder="Search by name, email, or phone..."
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={onSearch}
                                    disabled={searching || !searchQuery.trim()}
                                    className="px-5 py-3 text-sm font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {searching ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        </span>
                                    ) : (
                                        "Search"
                                    )}
                                </button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                                        {searchResults.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => onSelectUser(user)}
                                                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 group"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 transition-colors">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">
                                                        {user.fullName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <UserIcon className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results - Only show after search has been performed */}
                            {hasSearched && searchQuery && !searching && searchResults.length === 0 && (
                                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                    <UserIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">
                                        No students found matching &quot;{searchQuery}&quot;
                                    </p>
                                </div>
                            )}

                            {/* Prompt to search - Show when query entered but not searched yet */}
                            {searchQuery && !hasSearched && searchResults.length === 0 && (
                                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                    <SearchIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">
                                        Click <span className="font-medium text-slate-600">Search</span> to find students
                                    </p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!searchQuery && searchResults.length === 0 && (
                                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                    <SearchIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">
                                        Enter a name, email, or phone to search
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Course Selection - Only show when user is selected */}
                {selectedUser && (
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Select Courses ({selectedCourses.size} selected)
                        </label>
                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
                            {courses.map((course) => (
                                <label
                                    key={course.id}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <div
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                            selectedCourses.has(course.id)
                                                ? "bg-slate-900 border-slate-900 text-white"
                                                : "border-slate-300 hover:border-slate-400"
                                        }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onToggleCourse(course.id);
                                        }}
                                    >
                                        {selectedCourses.has(course.id) && (
                                            <CheckIcon className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-700">{course.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
