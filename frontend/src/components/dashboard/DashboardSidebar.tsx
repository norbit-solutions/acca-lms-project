"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Minimal line icons with thin stroke
const DashboardIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const CoursesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ProfileIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const LogoutIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

interface DashboardSidebarProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({ isMobileOpen, onClose }: DashboardSidebarProps) {
    const pathname = usePathname();

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
            active: pathname?.startsWith("/dashboard/my-courses") || pathname?.startsWith("/dashboard/courses") || false,
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
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-neutral-50 z-50
                    transition-transform duration-300 ease-out
                    lg:translate-x-0
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="h-16 px-5 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">A</span>
                        </div>
                        <span className="text-neutral-800 font-normal text-[15px] tracking-tight">
                            ACCA LMS
                        </span>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 mt-4">
                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-normal
                                        transition-colors duration-150
                                        ${item.active
                                            ? "bg-white text-neutral-900 shadow-sm"
                                            : "text-neutral-500 hover:text-neutral-700 hover:bg-white/50"
                                        }
                                    `}
                                >
                                    <Icon className={`w-[18px] h-[18px] ${item.active ? "text-neutral-700" : "text-neutral-400"}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-4">
                    <a
                        href="/api/auth/logout"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-normal text-neutral-400 hover:text-neutral-600 hover:bg-white/50 transition-colors"
                    >
                        <LogoutIcon className="w-[18px] h-[18px]" />
                        <span>Sign out</span>
                    </a>
                </div>
            </aside>
        </>
    );
}
