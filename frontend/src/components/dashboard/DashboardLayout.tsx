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

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render dashboard if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Sidebar */}
            <DashboardSidebar
                isMobileOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Navbar */}
                <DashboardNav onMenuClick={() => setIsMobileSidebarOpen(true)} />

                {/* Page Content */}
                <main className="px-6 py-8 lg:px-12 lg:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
