"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseNavbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 px-6 md:px-10 py-4 w-full max-w-6xl shadow-sm rounded-2xl">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group"
            aria-label="Go back"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </div>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-display font-medium tracking-tight absolute left-1/2 -translate-x-1/2"
          >
            Learnspire
          </Link>

          {/* Empty spacer for balance */}
          <div className="w-20" />
        </div>
      </div>
    </nav>
  );
}
