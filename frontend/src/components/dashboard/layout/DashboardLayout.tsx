"use client";
import { useState } from "react";
import DashboardSidebar from "../components/navbar/DashboardSidebar";
import DashboardNav from "../components/navbar/DashboardNav";
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    // Load collapsed state from localStorage using lazy initializer
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false; // SSR safety
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState !== null ? JSON.parse(savedState) : false;
    });

    // Save collapsed state to localStorage
    const handleToggleCollapse = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

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
