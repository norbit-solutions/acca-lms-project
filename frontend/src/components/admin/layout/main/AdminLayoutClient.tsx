"use client";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastProvider } from "@/lib/toast";
import { ConfirmProvider } from "@/components/ConfirmProvider";
import { MenuIcon } from "@/lib/icons";
import AdminSideNavbar from "../../components/sidenavbar/AdminSideNavbar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);



  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };


  const currentUser = user ;

  return (
    <ConfirmProvider>
      <ToastProvider />
      <div className="min-h-screen bg-white! font-display!">
        {/* Sidebar */}
        <AdminSideNavbar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
        />

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <MenuIcon />
          </button>
          <span className="font-display font-semibold text-slate-900">
            Learnspire Admin
          </span>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 pt-18 lg:pt-8">{children}</div>
        </main>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ConfirmProvider>
  );
}

