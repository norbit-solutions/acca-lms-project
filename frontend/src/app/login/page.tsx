import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex font-display! bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="p-6 md:p-8">
          <Link
            href="/"
            className="text-2xl font-display font-medium tracking-tight"
          >
            ACCA LMS
          </Link>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-12 pb-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-xl md:text-3xl font-display mb-2">
                Welcome back
              </h1>
              <p className="text-black text-md font-display font-thin!">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Login Form Component */}
            <Suspense
              fallback={
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
            >
              <LoginForm />
            </Suspense>

            {/* Footer */}
            <p className="mt-4 text-center text-gray-400 text-sm">
              Need help?{" "}
              <Link
                href="https://wa.me/94XXXXXXXXX"
                target="_blank"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Contact support
              </Link>
            </p>
          </div>
        </main>
      </div>

      {/* Right Side - Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black rounded-l-4xl">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80"
          alt="Students studying"
          fill
          className="object-cover opacity-60 rounded-l-4xl"
          priority
        />
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="max-w-md">
            <blockquote className="text-white text-2xl font-display mb-6">
              &ldquo;The best investment you can make is in yourself.&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur" />
              <div>
                <p className="text-white font-medium">2,000+ Students</p>
                <p className="text-gray-300 text-sm">
                  Trust ACCA LMS for their success
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
