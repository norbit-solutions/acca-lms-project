"use client";

import { useAuthStore } from "@/lib/store";
import Link from "next/link";

export default function CourseNavbar() {
  const { isAuthenticated, user } = useAuthStore();

  const dashboardUrl = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 font-display!">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Learnspire
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href={dashboardUrl}
                className="text-sm font-medium bg-black px-5 py-2 rounded-full text-white hover:text-black transition-colors"
              >
                {user?.role === "admin" ? "Admin" : "Dashboard"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium bg-black px-5 py-2 rounded-full hover:text-black transition-colors"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

