
import { AdminCourse } from "@/types";
import { FilterIcon } from "@/lib/icons";

interface EnrollmentsFilterProps {
    courses: AdminCourse[];
    filterCourse: number | null;
    onFilterChange: (courseId: number | null) => void;
}

export default function EnrollmentsFilter({
    courses,
    filterCourse,
    onFilterChange,
}: EnrollmentsFilterProps) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-slate-100">
            <FilterIcon />
            <select
                value={filterCourse || ""}
                onChange={(e) => onFilterChange(e.target.value ? Number(e.target.value) : null)}
                className="text-sm bg-transparent border-0 focus:ring-0 text-slate-600 cursor-pointer"
            >
                <option value="">All Courses</option>
                {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                        {course.title}
                    </option>
                ))}
            </select>
            {filterCourse && (
                <button
                    onClick={() => onFilterChange(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
