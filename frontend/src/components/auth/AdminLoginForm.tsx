"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Input, Button } from "@/components/ui";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const currentUser = useAuthStore.getState().user;

      if (currentUser?.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        logout();
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
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
          type="email"
          className="font-display! text-xs tracking-widest"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          className="font-display! text-xs tracking-widest"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />

        <Button type="submit" isLoading={loading} fullWidth size="lg">
          Sign In
        </Button>
      </form>

      {/* User Login Link */}
      <div className="mt-8 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500">
          Not an admin?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Go to user login
          </Link>
        </p>
      </div>
    </div>
  );
}
