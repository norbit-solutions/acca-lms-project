"use client";

import { useAuthStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const MenuIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
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
        <nav className="h-14 bg-white px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30 border-b border-neutral-100">
            {/* Left: Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-neutral-400 hover:text-neutral-600 transition-colors -ml-2"
            >
                <MenuIcon />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden lg:block" />

            {/* Right: User Menu */}
            <div className="ml-auto relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                    <div className="w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                        <UserIcon />
                    </div>
                    <span className="hidden md:inline text-sm font-normal">{user?.fullName || "Account"}</span>
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-1">
                        {/* User Info (mobile) */}
                        <div className="md:hidden px-4 py-2 border-b border-neutral-100">
                            <p className="text-sm text-neutral-700">{user?.fullName}</p>
                            <p className="text-xs text-neutral-400">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <button
                            onClick={() => {
                                router.push("/dashboard/profile");
                                setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-neutral-600 hover:bg-neutral-50 transition-colors text-sm font-normal"
                        >
                            <UserIcon />
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors text-sm font-normal"
                        >
                            <LogoutIcon />
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
