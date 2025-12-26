"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-full px-6 md:px-10 py-4 flex items-center justify-between w-full max-w-6xl shadow-sm">
          <Link
            href="/"
            className="text-2xl font-display font-medium tracking-tight"
          >
            Learn Spear
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-600">
            <Link href="#" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link
              href="#all-courses"
              className="hover:text-black transition-colors"
            >
              Courses
            </Link>
            <Link
              href="#mentors"
              className="hover:text-black transition-colors"
            >
              Mentor
            </Link>
            <Link
              href="#benefits"
              className="hover:text-black transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="hover:text-black transition-colors"
            >
              Testimonials
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                My Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-gray-600"
                >
                  Log In
                </Link>
                <Link
                  href="https://wa.me/94XXXXXXXXX?text=Hello, I would like to know more about Learn Spear"
                  target="_blank"
                  className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={openMobileMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-40 ${isMobileMenuOpen ? "" : "hidden"}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={closeMobileMenu}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Logo */}
            <div className="mb-8">
              <Link
                href="/"
                className="text-2xl font-display font-medium tracking-tight"
              >
                Learn Spear
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4">
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#all-courses"
                onClick={closeMobileMenu}
                className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Courses
              </Link>
              <Link
                href="#mentors"
                onClick={closeMobileMenu}
                className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Mentor
              </Link>
              <Link
                href="#benefits"
                onClick={closeMobileMenu}
                className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Benefits
              </Link>
              <Link
                href="#testimonials"
                onClick={closeMobileMenu}
                className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Testimonials
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="mt-8 space-y-3">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="block text-center bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-center text-sm font-medium py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="https://wa.me/94XXXXXXXXX?text=Hello, I would like to know more about Learn Spear"
                    target="_blank"
                    className="block text-center bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Contact Us
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
