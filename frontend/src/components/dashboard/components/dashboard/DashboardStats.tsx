interface DashboardStatsProps {
  coursesCount: number;
  completedLessons: number;
  totalLessons: number;
  avgProgress: number;
}

export default function DashboardStats({ 
  coursesCount, 
  completedLessons, 
  totalLessons, 
  avgProgress 
}: DashboardStatsProps) {
  return (
    <div className="flex flex-wrap gap-8 mb-12 pb-8 border-b border-neutral-100">
      <div>
        <p className="text-3xl font-light text-neutral-800">
          {coursesCount}
        </p>
        <p className="text-xs text-neutral-400 mt-1">Courses</p>
      </div>
      <div>
        <p className="text-3xl font-light text-neutral-800">
          {completedLessons}/{totalLessons}
        </p>
        <p className="text-xs text-neutral-400 mt-1">Lessons completed</p>
      </div>
      <div>
        <p className="text-3xl font-light text-neutral-800">
          {avgProgress}%
        </p>
        <p className="text-xs text-neutral-400 mt-1">Average progress</p>
      </div>
    </div>
  );
}
