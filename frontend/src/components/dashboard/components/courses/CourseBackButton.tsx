
import { BackIcon } from "@/lib";
import Link from "next/link";

interface CourseBackButtonProps {
  href?: string;
  title?: string;
}

export default function CourseBackButton({ 
  title
}: CourseBackButtonProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link
        href='/dashboard/my-courses'
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
      >
        <BackIcon className="w-5 h-5 text-gray-600" />
      </Link>
      {title && (
        <h1 className="text-base md:text-2xl font-bold text-black truncate">{title}</h1>
      )}
    </div>
  );
}
