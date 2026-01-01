
import { Enrollment, AdminCourse } from "@/types";
import { CloseIcon, CheckIcon } from "@/lib/icons";

interface EditEnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    enrollment: Enrollment;
    currentEnrollments: Enrollment[];
    availableCourses: AdminCourse[];
    selectedCourses: Set<number>;
    onToggleCourse: (courseId: number) => void;
    onEnrollAdditional: () => void;
    enrolling: boolean;
}

export default function EditEnrollmentModal({
    isOpen,
    onClose,
    enrollment,
    currentEnrollments,
    availableCourses,
    selectedCourses,
    onToggleCourse,
    onEnrollAdditional,
    enrolling,
}: EditEnrollmentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="font-medium text-slate-900">Add Courses</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh]">
                    {/* Student Info */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                                {enrollment.user?.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">{enrollment.user?.fullName}</p>
                                <p className="text-xs text-slate-400">{enrollment.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Enrollments */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Current Enrollments</label>
                        <div className="flex flex-wrap gap-1.5">
                            {currentEnrollments.map((enr) => (
                                <span
                                    key={enr.id}
                                    className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                                >
                                    {enr.course?.title}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Available Courses - Multi-select */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                            Add New Courses ({selectedCourses.size} selected)
                        </label>
                        {availableCourses.length > 0 ? (
                            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                                {availableCourses.map((course) => (
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
                        ) : (
                            <p className="text-sm text-slate-400 italic">Already enrolled in all courses.</p>
                        )}
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
                        onClick={onEnrollAdditional}
                        disabled={selectedCourses.size === 0 || enrolling}
                        className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {enrolling ? "Enrolling..." : `Add ${selectedCourses.size} Course${selectedCourses.size !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
