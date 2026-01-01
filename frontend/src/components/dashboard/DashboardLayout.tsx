"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNav from "./DashboardNav";
import Loader from "../admin/Loader";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isAuthenticated, isLoading, user } = useAuthStore();
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

    // Redirect to login if not authenticated, or to admin dashboard if admin
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        } else if (!isLoading && isAuthenticated && user?.role === "admin") {
            // Admins should use the admin dashboard
            router.push("/admin");
        }
    }, [isLoading, isAuthenticated, user, router]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <Loader />
        );
    }

    // Don't render dashboard if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 !font-display">
            {/* Sidebar */}
            <DashboardSidebar
                isMobileOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'}`}>
                {/* Top Navbar */}
                <DashboardNav
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebar={handleToggleCollapse}
                />

                {/* Page Content */}
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
