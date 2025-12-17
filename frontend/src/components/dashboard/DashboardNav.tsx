"use client";

import { useAuthStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

interface DashboardNavProps {
    onMenuClick: () => void;
}

export default function DashboardNav({ onMenuClick }: DashboardNavProps) {
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
        <nav className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left: Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <MenuIcon />
            </button>

            {/* Center: Page Title (visible on mobile) */}
            <div className="lg:hidden">
                <h2 className="font-display font-bold text-slate-900">Dashboard</h2>
            </div>

            {/* Right: User Menu */}
            <div className="ml-auto relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                    <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <UserIcon />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-slate-900">{user?.fullName || "Student"}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <ChevronDownIcon />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User Info (mobile) */}
                        <div className="md:hidden px-4 py-3 border-b border-slate-100">
                            <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="px-2 py-1">
                            <button
                                onClick={() => {
                                    router.push("/dashboard/profile");
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-sm"
                            >
                                <UserIcon />
                                <span>My Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                            >
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
