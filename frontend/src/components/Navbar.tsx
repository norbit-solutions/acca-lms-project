"use client";

import { useSocialSafe } from "@/context/SocialContext";
import { useAuthStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { whatsappNumber } = useSocialSafe();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Admins go to admin dashboard, students go to user dashboard
  const dashboardUrl = user?.role === "admin" ? "/admin" : "/dashboard";

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Closing: trigger animation first
      setIsAnimating(false);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "";
      }, 300);
    } else {
      // Opening
      setIsMobileMenuOpen(true);
      document.body.style.overflow = "hidden";
      // Trigger animation after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "";
      }, 300);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const navLinks = [
    { href: "#", label: "Home" },
    { href: "#all-courses", label: "Courses" },
    { href: "#mentors", label: "Mentor" },
    { href: "#benefits", label: "Benefits" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div
          className={`bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5 px-6 md:px-10 py-4 w-full max-w-6xl transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "rounded-2xl" : "rounded-2xl"
          }`}
        >
          {/* Main navbar row */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/images/learnspire-logo.png"
                width={100}
                height={100}
                quality={1000}
                alt="Learnspire Logo"
                className="w-20 object-cover scale-[1.9] md:scale-[2.4]"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-600">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  href={dashboardUrl}
                  className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                >
                  {user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
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
                    href={`https://wa.me/${whatsappNumber}?text=Hello, I would like to know more about Learnspire`}
                    target="_blank"
                    className="bg-[#333c8a] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#10195c]  transition-colors"
                  >
                    Contact Us
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Animated Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors relative w-10 h-10 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-5 relative flex flex-col justify-center items-center">
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-out ${
                    isAnimating
                      ? "rotate-45 translate-y-0"
                      : "-translate-y-2"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-out ${
                    isAnimating ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-out ${
                    isAnimating
                      ? "-rotate-45 translate-y-0"
                      : "translate-y-2"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              maxHeight: isAnimating ? "500px" : "0px",
              marginTop: isMobileMenuOpen ? (isAnimating ? "16px" : "0px") : "0px",
            }}
          >
            {/* Divider */}
            <div
              className={`h-px bg-gray-200 transition-all duration-300 ${
                isAnimating ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Navigation Links */}
            <nav className="py-4 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block py-3 px-2 text-lg font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-300 ${
                    isAnimating
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{
                    transitionDelay: isAnimating ? `${index * 50}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div
              className={`h-px bg-gray-200 transition-all duration-300 ${
                isAnimating ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Auth Buttons */}
            <div
              className={`py-4 space-y-3 transition-all duration-300 ${
                isAnimating
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: isAnimating ? "250ms" : "0ms",
              }}
            >
              {isAuthenticated ? (
                <Link
                  href={dashboardUrl}
                  onClick={closeMobileMenu}
                  className="block text-center bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  {user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block text-center text-sm font-medium py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href={`https://wa.me/${whatsappNumber}?text=Hello, I would like to know more about Learnspire`}
                    target="_blank"
                    onClick={closeMobileMenu}
                    className="block text-center bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Contact Us
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
          style={{ top: "0" }}
        />
      )}
    </>
  );
}
