import Link from "next/link";
import { AdminLoginForm } from "@/components/auth";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex bg-black font-display!">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/20 rounded-full" />
          <div className="absolute top-40 left-40 w-96 h-96 border border-white/10 rounded-full" />
          <div className="absolute bottom-20 right-20 w-64 h-64 border border-white/15 rounded-full" />
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-display font-medium tracking-tight text-white relative z-10"
        >
          Learn Spear
        </Link>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-display text-white mb-6 leading-tight">
            Admin
            <br />
            Dashboard
          </h2>
          <p className="text-gray-400 text-lg max-w-sm">
            Manage courses, users, enrollments and content from your central
            control panel.
          </p>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm relative z-10">
          © 2025 Learn Spear. All rights reserved.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col bg-white lg:rounded-l-[3rem]">
        {/* Mobile Header */}
        <header className="lg:hidden p-6">
          <Link
            href="/"
            className="text-2xl font-display font-medium tracking-tight"
          >
            Learn Spear
          </Link>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-12 py-12">
          <div className="w-full max-w-md">
            {/* Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-2xl mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-display mb-3">Admin Portal</h1>
              <p className="text-gray-500 text-lg">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Admin Login Form Component */}
            <AdminLoginForm />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 lg:hidden">
          <p className="text-center text-sm text-gray-400">
            Not an admin?{" "}
            <Link
              href="/login"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Go to user login
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
