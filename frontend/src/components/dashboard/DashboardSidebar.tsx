"use client";

import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Minimal line icons with thin stroke
const DashboardIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const CoursesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const ProfileIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const LogoutIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const CollapseIcon = ({
  className = "w-5 h-5",
  isCollapsed,
}: {
  className?: string;
  isCollapsed: boolean;
}) => (
  <svg
    className={`${className} transition-transform duration-300 ${
      isCollapsed ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  </svg>
);

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({
  isMobileOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: DashboardIcon,
      active: pathname === "/dashboard",
    },
    {
      name: "My Courses",
      href: "/dashboard/my-courses",
      icon: CoursesIcon,
      active:
        pathname?.startsWith("/dashboard/my-courses") ||
        pathname?.startsWith("/dashboard/courses") ||
        false,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: ProfileIcon,
      active: pathname === "/dashboard/profile",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed top-0 left-0 h-full z-50
                    bg-white border-r border-slate-200
                    shadow-sm
                    transition-all duration-300 ease-in-out
                    lg:translate-x-0
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    ${isCollapsed ? "w-[72px]" : "w-64"}
                `}
      >
        {/* Header */}
        <div
          className={`h-16 flex items-center justify-between border-b border-slate-100 ${
            isCollapsed ? "px-4" : "px-5"
          }`}
        >
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <span className="text-white font-semibold text-sm">LS</span>
            </div>
            <span
              className={`text-slate-800 font-semibold text-[15px] tracking-tight transition-opacity duration-200 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              Learnspire
            </span>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`mt-6 ${isCollapsed ? "px-2" : "px-3"}`}>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  title={isCollapsed ? item.name : undefined}
                  className={`
                                        group relative flex items-center gap-3 rounded-xl text-[13px] font-medium
                                        transition-all duration-200
                                        ${
                                          isCollapsed
                                            ? "px-0 py-3 justify-center"
                                            : "px-4 py-3"
                                        }
                                        ${
                                          item.active
                                            ? "bg-slate-100 text-slate-900"
                                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                        }
                                    `}
                >
                  {/* Active indicator */}
                  {item.active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-900 rounded-r-full" />
                  )}

                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                      item.active
                        ? "text-slate-700"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />

                  <span
                    className={`transition-opacity duration-200 ${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden absolute"
                        : "opacity-100"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-slate-800" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 border-t border-slate-100 ${
            isCollapsed ? "px-2 py-3" : "px-3 py-4"
          }`}
        >
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Sign out" : undefined}
            className={`
                            w-full group relative flex items-center gap-3 rounded-xl text-[13px] font-medium
                            text-slate-400 hover:text-red-500 hover:bg-red-50
                            transition-all duration-200
                            ${
                              isCollapsed
                                ? "px-0 py-3 justify-center"
                                : "px-4 py-3"
                            }
                        `}
          >
            <LogoutIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
            <span
              className={`transition-opacity duration-200 ${
                isCollapsed
                  ? "opacity-0 w-0 overflow-hidden absolute"
                  : "opacity-100"
              }`}
            >
              Sign out
            </span>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">
                Sign out
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-slate-800" />
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
