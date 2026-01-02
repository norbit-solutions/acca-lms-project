"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/lib";

interface CourseBackButtonProps {
  href?: string;
  label?: string;
}

export default function CourseBackButton({ 
  href = "/dashboard", 
  label = "Dashboard" 
}: CourseBackButtonProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => router.push(href)}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-black text-sm transition-colors"
      >
        <BackIcon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    </div>
  );
}
