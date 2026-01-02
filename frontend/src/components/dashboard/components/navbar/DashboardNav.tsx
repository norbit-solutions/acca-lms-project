"use client";

import { useAuthStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MenuIcon, UserIcon, LogoutIcon, ChevronDownIcon, getInitials } from "@/lib";

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
        <nav className="h-14 bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 border-b border-gray-200">
            {/* Left: Menu Buttons */}
            <div className="flex items-center gap-2">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <MenuIcon />
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={onToggleSidebar}
                    title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="hidden lg:flex p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Right: User Menu */}
            <div className="ml-auto relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                        flex items-center gap-2 px-2 py-1.5 rounded-lg
                        text-gray-600 hover:text-black hover:bg-gray-100
                        transition-colors
                        ${isDropdownOpen ? 'bg-gray-100' : ''}
                    `}
                >
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.fullName ? getInitials(user.fullName) : "?"}
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                        {user?.fullName || "Account"}
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 overflow-hidden">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-black">{user?.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    router.push("/dashboard/profile");
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                <UserIcon className="w-4 h-4" />
                                Profile
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 py-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                <LogoutIcon className="w-4 h-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
