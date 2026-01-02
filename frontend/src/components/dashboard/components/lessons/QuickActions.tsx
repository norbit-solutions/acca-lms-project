import Link from "next/link";

interface QuickActionsProps {
  courseSlug: string;
}

export default function QuickActions({ courseSlug }: QuickActionsProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 w-full lg:max-w-md">
      <h3 className="text-sm font-bold text-black mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Link
          href={`/dashboard/courses/${courseSlug}`}
          className="flex items-center gap-3 p-3 bg-white hover:bg-gray-100 rounded-xl transition-all group text-sm text-gray-700 hover:text-black"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>View all lessons</span>
        </Link>
      </div>
    </div>
  );
}
