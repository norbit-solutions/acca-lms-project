"use client";

import { ReactNode, useEffect, useCallback } from "react";
import { CloseIcon } from "@/lib/icons";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalButton {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: ModalSize;
  buttons?: ModalButton[];
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  footerClassName?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

const buttonVariants: Record<string, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "lg",
  buttons = [],
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  footerClassName = "",
  onSubmit,
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const Wrapper = onSubmit ? "form" : "div";
  const wrapperProps = onSubmit ? { onSubmit } : {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
      onClick={handleOverlayClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn" />

      {/* Modal Container */}
      <div
        className={`
          relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl 
          max-h-[90vh] flex flex-col overflow-hidden
          animate-modalSlideIn
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex-1 pr-4">
              {title && (
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
                aria-label="Close modal"
              >
                <CloseIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <Wrapper {...wrapperProps} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {children}
          </div>

          {/* Footer with Buttons */}
          {buttons.length > 0 && (
            <div
              className={`
                flex items-center justify-end gap-3 px-6 py-4 
                border-t border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50
                ${footerClassName}
              `}
            >
              {buttons.map((button, index) => (
                <button
                  key={index}
                  type={button.type || "button"}
                  onClick={button.onClick}
                  disabled={button.disabled || button.isLoading}
                  className={`
                    inline-flex items-center justify-center gap-2
                    px-5 py-2.5 text-sm font-medium rounded-xl
                    transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${buttonVariants[button.variant || "secondary"]}
                  `}
                >
                  {button.isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{button.loadingText || "Loading..."}</span>
                    </>
                  ) : (
                    button.label
                  )}
                </button>
              ))}
            </div>
          )}
        </Wrapper>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
