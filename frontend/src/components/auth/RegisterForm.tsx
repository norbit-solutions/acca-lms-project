"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Input, Button } from "@/components/ui";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!agreed) {
      setError("Please accept the terms and privacy policy");
      return;
    }

    setLoading(true);

    try {
      await register({ fullName, email, phone, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-5">
          <Input
            label="Full name"
            type="text"
            className="font-display! text-xs tracking-widest"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
          />
          <Input
            label="Phone number"
            type="tel"
            value={phone}
            className="font-display! text-xs tracking-widest"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+94 XX XXX XXXX"
            required
            autoComplete="tel"
          />
        </div>
        <div className="flex gap-5">
          <Input
            label="Email address"
            type="email"
            className="font-display! text-xs tracking-widest"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            className="font-display! text-xs tracking-widest"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm password"
            type="password"
            className="font-display! text-xs tracking-widest"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            autoComplete="new-password"
          />
        </div>

        {/* Terms */}
        <label className="flex items-center justify-start gap-3 cursor-pointer group">
          <div className="relative ">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-black peer-checked:bg-black transition-all group-hover:border-gray-400" />
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-600">
            I agree to the{" "}
            <Link href="/terms" className="text-black hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-black hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          isLoading={loading}
          fullWidth
          size="lg"
          className="mt-2"
        >
          Create Account
        </Button>
      </form>

      {/* Login Link - Mobile only */}
      <p className="mt-8 text-center text-gray-500 lg:hidden">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
