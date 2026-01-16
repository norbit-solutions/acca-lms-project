import { formatDuration } from "@/lib";
import Image from "next/image";

interface CourseInfoCardProps {
  description?: string;
  thumbnail?: string;
  chaptersCount: number;
  lessonsCount: number;
  totalDuration: number;
  completedLessons: number;
  progressPercentage: number;
}

export default function CourseInfoCard({
  description,
  thumbnail,
  chaptersCount,
  lessonsCount,
  totalDuration,
  completedLessons,
  progressPercentage,
}: CourseInfoCardProps) {
  const isCompleted = progressPercentage === 100;
  
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
      {/* Thumbnail Banner */}
      {thumbnail && (
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={thumbnail}
            alt="Course thumbnail"
            fill
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Progress Badge */}
          <div className="absolute bottom-4 right-4">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
              isCompleted 
                ? "bg-green-500/70 text-white" 
                : "bg-white/90 text-[#333c8a]"
            }`}>
              {isCompleted ? "Completed" : `${Math.round(progressPercentage)}% Complete`}
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Description */}
        {description && (
          <p className="text-black text-sm leading-relaxed mb-6">
            {description}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-black/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#333c8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-2xl font-thin text-[#333c8a]">{chaptersCount}</div>
            <div className="text-xs text-black uppercase tracking-wide">Chapters</div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-black/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#333c8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-thin text-[#333c8a]">{lessonsCount}</div>
            <div className="text-xs text-black uppercase tracking-wide">Lessons</div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-black/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#333c8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-thin text-[#333c8a]">
              {totalDuration > 0 ? formatDuration(totalDuration) : "—"}
            </div>
            <div className="text-xs text-black uppercase tracking-wide">Duration</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-black">Your Progress</span>
            <span className="text-sm font-thin text-[#333c8a]">
              {completedLessons}/{lessonsCount} lessons
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? "bg-green-500" : "bg-black"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
