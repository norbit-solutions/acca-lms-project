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
        <p className="text-3xl font-light text-[#333c8a]">
          {coursesCount}
        </p>
        <p className="text-xs text-black mt-1">Courses</p>
      </div>
      <div>
        <p className="text-3xl font-light text-[#333c8a]">
          {completedLessons}/{totalLessons}
        </p>
        <p className="text-xs text-black mt-1">Lessons completed</p>
      </div>
      <div>
        <p className="text-3xl font-light text-[#333c8a]">
          {avgProgress}%
        </p>
        <p className="text-xs text-black mt-1">Average progress</p>
      </div>
    </div>
  );
}
