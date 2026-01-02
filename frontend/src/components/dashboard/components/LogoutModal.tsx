"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/Modal";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleClose = () => {
    if (!isLoggingOut) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Sign Out"
      subtitle="Are you sure you want to sign out of your account?"
      size="sm"
      closeOnOverlayClick={!isLoggingOut}
      closeOnEscape={!isLoggingOut}
      showCloseButton={!isLoggingOut}
      buttons={[
        {
          label: "Cancel",
          onClick: handleClose,
          variant: "secondary",
          disabled: isLoggingOut,
        },
        {
          label: "Sign Out",
          onClick: handleLogout,
          variant: "primary",
          isLoading: isLoggingOut,
          loadingText: "Signing out...",
        },
      ]}
    >
      {/* Icon */}
      <div className="flex justify-center py-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-slate-600" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" 
            />
          </svg>
        </div>
      </div>
    </Modal>
  );
}
