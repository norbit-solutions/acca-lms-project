"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { UserIcon, LogoutIcon, ChevronDownIcon, getInitials } from "@/lib";
import LogoutModal from "../LogoutModal";

interface DashboardNavProps {
    onMenuClick: () => void;
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}

export default function DashboardNav({ onMenuClick, isSidebarCollapsed, onToggleSidebar }: DashboardNavProps) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setIsLogoutModalOpen(true);
    };

    return (
        <>
            <nav className="h-14 bg-white px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 border-b border-gray-200">
                {/* Left: Menu Buttons */}
                <div className="flex items-center gap-2">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-[#333c8a] hover:bg-[#333c8a]/10 rounded-lg transition-all duration-300"
                    >
                        <svg 
                            className="w-5 h-5 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth={1.5} 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    {/* Desktop Sidebar Toggle - Hamburger (expanded) / Expand (collapsed) */}
                    <button
                        onClick={onToggleSidebar}
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="hidden lg:flex items-center justify-center p-2 text-[#333c8a] hover:bg-[#333c8a]/10 rounded-lg transition-all duration-300"
                    >
                        <svg 
                            className="w-5 h-5 transition-all duration-300"
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth={1.5} 
                            viewBox="0 0 24 24"
                        >
                            {isSidebarCollapsed ? (
                                /* Expand icon - double chevron right */
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 19l-7-7 7-7" />
                                </>
                            ) : (
                                /* Hamburger menu icon - 3 lines */
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Right: User Menu */}
                <div className="ml-auto relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`
                            flex items-center gap-2 px-2 py-1.5 rounded-lg
                            text-black hover:text-[#333c8a] hover:bg-gray-100
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
                                <p className="text-sm font-medium text-[#333c8a]">{user?.fullName}</p>
                                <p className="text-xs text-black truncate">{user?.email}</p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        router.push("/dashboard/profile");
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-[#333c8a] transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    Profile
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 py-1">
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-[#333c8a] transition-colors"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Logout Modal */}
            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
            />
        </>
    );
}
