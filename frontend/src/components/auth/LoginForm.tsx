"use client";

import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("session_expired") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log(`[LOGIN DEBUG] Form submitted with email: ${email}`);
    
    try {
      console.log(`[LOGIN DEBUG] Calling login...`);
      await login(email, password);
      console.log(`[LOGIN DEBUG] Login successful`);
      
      const currentUser = useAuthStore.getState().user;
      console.log(`[LOGIN DEBUG] Current user:`, currentUser ? { id: currentUser.id, role: currentUser.role, email: currentUser.email } : 'NO USER');
      console.log(`[LOGIN DEBUG] Document cookies: ${document.cookie}`);
      console.log(`[LOGIN DEBUG] localStorage token: ${localStorage.getItem('token') ? 'YES' : 'NO'}`);
      
      if (currentUser?.role === "admin") {
        console.log(`[LOGIN DEBUG] User is admin, redirecting to /admin`);
        console.log(`[LOGIN DEBUG] About to call router.push("/admin")`);
        router.push("/admin");
        console.log(`[LOGIN DEBUG] router.push("/admin") called`);
      } else {
        console.log(`[LOGIN DEBUG] User is NOT admin (role: ${currentUser?.role}), redirecting to /dashboard`);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.log(`[LOGIN DEBUG] Login error:`, err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Session Expired Warning */}
      {sessionExpired && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-4 rounded-2xl mb-6 text-sm flex items-start gap-3">
          <svg
            className="w-5 h-5 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Your session has expired. Please sign in again.</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl mb-6 text-sm flex items-start gap-3">
          <svg
            className="w-5 h-5 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          className="font-display! text-xs tracking-widest"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <div>
          <Input
            label="Password"
            type="password"
            className="font-display! text-xs tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-black font-display font-thin! hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          fullWidth
          size="lg"
          className="mt-2 font-display! tracking-wider"
        >
          Sign In
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-8 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm font-display font-thin!">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black font-display hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
