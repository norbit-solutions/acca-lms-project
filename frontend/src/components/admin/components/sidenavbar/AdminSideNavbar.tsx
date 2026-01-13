"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useConfirm } from "@/components/ConfirmProvider";
import {
  DashboardIcon,
  CoursesIcon,
  EnrollmentsIcon,
  LogoutIcon,
  CloseIcon,
  ViewSiteIcon,
  personIcon,
} from "@/lib/icons";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: DashboardIcon },
  { name: "Courses", href: "/admin/courses", icon: CoursesIcon },
  { name: "Enrollments", href: "/admin/enrollments", icon: EnrollmentsIcon },
  { name: "Users", href: "/admin/users", icon: personIcon },
];

const contentNavigation = [
  { name: "Instructors", href: "/admin/instructors" },
  { name: "Testimonials", href: "/admin/testimonials" },
  { name: "FAQ", href: "/admin/faq" },
  { name: "Hero Section", href: "/admin/hero" },
  { name: "Social Links", href: "/admin/social" },
];

interface AdminSideNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  user: { fullName?: string } | null;
  onLogout: () => Promise<void>;
}

export default function AdminSideNavbar({
  isOpen,
  onClose,
  user,
  onLogout,
}: AdminSideNavbarProps) {
  const pathname = usePathname();
  const { showConfirm } = useConfirm();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async () => {
    const confirmed = await showConfirm({
      title: "Logout",
      message: "Are you sure you want to logout? You will need to sign in again to access the admin dashboard.",
      confirmText: "Logout",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      setIsLoggingOut(true);
      try {
        await onLogout();
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Image
              alt="Learnspire Logo"
              src="/images/logo.png"
              width={100}
              height={100}
              className="w-8 object-cover"
            />
          </div>
          <span className="font-display text-slate-900 font-semibold">
            Learnspire Admin
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Content Section */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Content
          </p>
          <ul className="space-y-1">
            {contentNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* View Site Link */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            <ViewSiteIcon />
            <span>View Landing Page</span>
          </a>
        </div>
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-semibold text-sm">
            {user?.fullName?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <LogoutIcon />
          )}
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
