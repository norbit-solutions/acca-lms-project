"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNav from "./DashboardNav";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
            setIsSidebarCollapsed(JSON.parse(savedState));
        }
    }, []);

    // Save collapsed state to localStorage
    const handleToggleCollapse = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-sm text-slate-400">Loading...</span>
                </div>
            </div>
        );
    }

    // Don't render dashboard if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <DashboardSidebar
                isMobileOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />

            {/* Main Content */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
                {/* Top Navbar */}
                <DashboardNav
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebar={handleToggleCollapse}
                />

                {/* Page Content */}
                <main className="px-6 py-8 lg:px-10 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
