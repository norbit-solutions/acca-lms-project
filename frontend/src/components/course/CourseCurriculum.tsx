interface Lesson {
  id: number;
  title: string;
  duration: number; // in seconds
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseCurriculumProps {
  chapters: Chapter[];
  description?: string;
  shortIntroduction?: string;
}

export default function CourseCurriculum({
  chapters,
  description,
  shortIntroduction,
}: CourseCurriculumProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-6">About this Course</h2>
      <div className="prose max-w-none text-gray-600 mb-12">
        {description || shortIntroduction}
      </div>

      <h2 className="text-2xl font-bold mb-6">Curriculum</h2>
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 font-bold flex justify-between items-center">
              <span>{chapter.title}</span>
              <span className="text-sm text-gray-500 font-normal">
                {chapter.lessons.length} Lessons
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700">{lesson.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(lesson.duration / 60)} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
