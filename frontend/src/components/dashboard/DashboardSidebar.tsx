"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Icons
const DashboardIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const CoursesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ProfileIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-72 bg-white 
          border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="h-20 px-6 flex items-center justify-between border-b border-slate-200">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h1 className="text-slate-900 font-display font-bold text-lg tracking-tight">
                                ACCA LMS
                            </h1>
                            <p className="text-slate-500 text-xs">Student Portal</p>
                        </div>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`
                  group flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-200
                  ${item.active
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }
                `}
                            >
                                <Icon
                                    className={`w-5 h-5 ${item.active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                                        }`}
                                />
                                <span>{item.name}</span>
                                {item.active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-900" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - Quick Stats or Help */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm font-medium">Need Help?</p>
                                <p className="text-slate-500 text-xs">Contact support</p>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/94XXXXXXXXX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
}
