"use client";

import { useState } from "react";
import { useSocialSafe } from "@/context/SocialContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutModal from "../LogoutModal";
import Image from "next/image";

// Simple line icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const CoursesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({
  isMobileOpen,
  onClose,
  isCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { whatsappNumber } = useSocialSafe();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: DashboardIcon,
      active: pathname === "/dashboard",
    },
    {
      name: "All Courses",
      href: "/dashboard/my-courses",
      icon: CoursesIcon,
      active:
        pathname?.startsWith("/dashboard/my-courses") ||
        pathname?.startsWith("/dashboard/courses") ||
        false,
    },
  ];

  const userItems = [
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: ProfileIcon,
      active: pathname === "/dashboard/profile",
    },
    {
      name: "Help & Support",
      href: `https://wa.me/${whatsappNumber}`,
      icon: HelpIcon,
      active: false,
      external: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed top-0 left-0 h-full z-50
                    bg-white border-r border-gray-100
                    transition-all duration-300
                    lg:translate-x-0
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    ${isCollapsed ? "w-16" : "w-56"}
                `}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center ${isCollapsed ? "px-4 justify-center" : "px-5"}`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <Image
                alt="Learnspire Logo"
                src="/images/logo.png"
                width={100}
                height={100}
                className="w-8 object-cover"
              />
            </div>
            {!isCollapsed && (
              <span className="text-black font-semibold text-lg">Learnspire</span>
            )}
          </Link>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-2 text-gray-400 hover:text-black"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Menu Section */}
        {!isCollapsed && (
          <div className="px-5 pt-4">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          </div>
        )}
        <nav className={`${isCollapsed ? "px-2" : "px-3"}`}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                                        flex items-center gap-3 rounded-lg text-sm font-medium
                                        transition-all
                                        ${isCollapsed ? "p-2.5 justify-center" : "px-3 py-2.5"}
                                        ${item.active
                      ? "bg-emerald-100 text-emerald-800"
                      : "text-gray-600 hover:bg-gray-50"
                    }
                                    `}
                >
                  <Icon />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        {!isCollapsed && (
          <div className="px-5 pt-6">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">User</p>
          </div>
        )}
        <nav className={`${isCollapsed ? "px-2" : "px-3"}`}>
          <div className="space-y-1">
            {userItems.map((item) => {
              const Icon = item.icon;
              const Component = item.external ? "a" : Link;
              const extraProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

              return (
                <Component
                  key={item.name}
                  href={item.href}
                  onClick={item.external ? undefined : onClose}
                  className={`
                                        flex items-center gap-3 rounded-lg text-sm font-medium
                                        transition-all
                                        ${isCollapsed ? "p-2.5 justify-center" : "px-3 py-2.5"}
                                        ${item.active
                      ? "bg-emerald-100 text-emerald-800"
                      : "text-gray-600 hover:bg-gray-50"
                    }
                                    `}
                  {...extraProps}
                >
                  <Icon />
                  {!isCollapsed && <span>{item.name}</span>}
                </Component>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className={`absolute bottom-0 left-0 right-0 border-t border-gray-100 ${isCollapsed ? "p-2" : "p-3"}`}>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`
                            w-full flex items-center gap-3 rounded-lg text-sm font-medium
                            text-gray-500 hover:bg-gray-50 hover:text-black
                            transition-all
                            ${isCollapsed ? "p-2.5 justify-center" : "px-3 py-2.5"}
                        `}
          >
            <LogoutIcon />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />
    </>
  );
}
