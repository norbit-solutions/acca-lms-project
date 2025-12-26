"use client";

import { useAuthStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const MenuIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const SidebarToggleIcon = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <svg className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

interface DashboardNavProps {
    onMenuClick: () => void;
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}

export default function DashboardNav({ onMenuClick, isSidebarCollapsed, onToggleSidebar }: DashboardNavProps) {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <nav className="h-16 bg-white px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 border-b border-slate-100 shadow-sm shadow-slate-100/50">
            {/* Left: Menu Buttons */}
            <div className="flex items-center gap-2">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 -ml-2"
                >
                    <MenuIcon />
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={onToggleSidebar}
                    title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="hidden lg:flex p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 -ml-1"
                >
                    <SidebarToggleIcon isCollapsed={isSidebarCollapsed} />
                </button>
            </div>

            {/* Right: User Menu */}
            <div className="ml-auto relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-xl
                        text-slate-500 hover:text-slate-700 hover:bg-slate-50
                        transition-all duration-200
                        ${isDropdownOpen ? 'bg-slate-50' : ''}
                    `}
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                        <span className="text-xs font-semibold">
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-slate-700">{user?.fullName || "Account"}</p>
                        <p className="text-xs text-slate-400">Student</p>
                    </div>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 overflow-hidden">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                            <p className="text-sm font-medium text-slate-700">{user?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    router.push("/dashboard/profile");
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors text-sm"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <UserIcon />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium">Profile</p>
                                    <p className="text-xs text-slate-400">Manage your account</p>
                                </div>
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-100 pt-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                            >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <LogoutIcon />
                                </div>
                                <span className="font-medium">Sign out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
