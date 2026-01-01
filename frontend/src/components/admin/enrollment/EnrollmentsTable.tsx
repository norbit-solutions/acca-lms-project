
import { Enrollment } from "@/types";
import { EditIcon, TrashIcon, UsersIcon } from "@/lib/icons";

interface EnrollmentsTableProps {
    enrollments: Enrollment[];
    onEdit: (enrollment: Enrollment) => void;
    onDelete: (enrollment: Enrollment) => void;
    onSelectNew: () => void;
}

export default function EnrollmentsTable({
    enrollments,
    onEdit,
    onDelete,
    onSelectNew,
}: EnrollmentsTableProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {enrollments.length > 0 ? (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Date</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-medium">
                                            {enrollment.user?.fullName.charAt(0) || "?"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{enrollment.user?.fullName || "Unknown"}</p>
                                            <p className="text-xs text-slate-400">{enrollment.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{enrollment.course?.title || "Unknown"}</td>
                                <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                                    {(() => {
                                        const dateStr = enrollment.enrolledAt || enrollment.createdAt;
                                        if (!dateStr) return "—";
                                        const date = new Date(dateStr);
                                        return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    })()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onEdit(enrollment)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                            title="Add courses"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(enrollment)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Remove"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="py-16 text-center">
                    <div className="text-slate-300 mb-4 flex justify-center">
                        <UsersIcon />
                    </div>
                    <p className="text-slate-500 mb-4">No enrollments yet</p>
                    <button
                        onClick={onSelectNew}
                        className="text-sm text-slate-900 underline underline-offset-4 hover:no-underline"
                    >
                        Enroll a student
                    </button>
                </div>
            )}
        </div>
    );
}
