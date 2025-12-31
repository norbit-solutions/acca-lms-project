/**
 * Dashboard Stats Component
 * Displays course statistics in a minimal inline format
 */

interface DashboardStatsProps {
    coursesCount: number;
    completedLessons: number;
    totalLessons: number;
    avgProgress: number;
}

export function DashboardStats({
    coursesCount,
    completedLessons,
    totalLessons,
    avgProgress,
}: DashboardStatsProps) {
    return (
        <div className="flex flex-wrap gap-12 mb-12 pb-8 border-b border-gray-200">
            <div>
                <p className="text-3xl font-light text-black">{coursesCount}</p>
                <p className="text-sm text-gray-500 mt-1">Courses</p>
            </div>
            <div>
                <p className="text-3xl font-light text-black">
                    {completedLessons}/{totalLessons}
                </p>
                <p className="text-sm text-gray-500 mt-1">Lessons completed</p>
            </div>
            <div>
                <p className="text-3xl font-light text-black">{avgProgress}%</p>
                <p className="text-sm text-gray-500 mt-1">Average progress</p>
            </div>
        </div>
    );
}
