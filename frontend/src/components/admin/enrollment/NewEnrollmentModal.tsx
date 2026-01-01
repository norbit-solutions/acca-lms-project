
import { User, AdminCourse } from "@/types";
import { CloseIcon, SearchIcon, CheckIcon } from "@/lib/icons";

interface NewEnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearch: () => void;
    searching: boolean;
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
    searchResults,
    selectedUser,
    onSelectUser,
    courses,
    selectedCourses,
    onToggleCourse,
    onEnroll,
    enrolling,
}: NewEnrollmentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="font-medium text-slate-900">New Enrollment</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh]">
                    {/* User Search */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Find Student</label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => onSearchQueryChange(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-slate-400 focus:ring-0 outline-none"
                                    placeholder="Search by email or phone..."
                                />
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <SearchIcon className="w-4 h-4" />
                                </div>
                            </div>
                            <button
                                onClick={onSearch}
                                disabled={searching}
                                className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                            >
                                {searching ? "..." : "Search"}
                            </button>
                        </div>

                        {/* Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
                                {searchResults.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => onSelectUser(user)}
                                        className="w-full px-3 py-2.5 text-left hover:bg-slate-50 text-sm"
                                    >
                                        <p className="font-medium text-slate-900">{user.fullName}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Selected User */}
                        {selectedUser && (
                            <div className="mt-2 p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                                        {selectedUser.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{selectedUser.fullName}</p>
                                        <p className="text-xs text-slate-400">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onSelectUser(null)}
                                    className="p-1 text-slate-400 hover:text-slate-600"
                                >
                                    <CloseIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Course Selection - Multi-select */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                            Select Courses ({selectedCourses.size} selected)
                        </label>
                        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                            {courses.map((course) => (
                                <label
                                    key={course.id}
                                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                                >
                                    <div
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCourses.has(course.id)
                                            ? "bg-slate-900 border-slate-900 text-white"
                                            : "border-slate-300"
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onToggleCourse(course.id);
                                        }}
                                    >
                                        {selectedCourses.has(course.id) && <CheckIcon className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className="text-sm text-slate-700">{course.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onEnroll}
                        disabled={!selectedUser || selectedCourses.size === 0 || enrolling}
                        className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {enrolling ? "Enrolling..." : `Enroll in ${selectedCourses.size} Course${selectedCourses.size !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
