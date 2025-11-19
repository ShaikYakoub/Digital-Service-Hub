"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // For now, just show a message
    setMessage(
      "Password reset functionality is not implemented yet. Please contact support."
    );
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4 rounded-lg border bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

          {message && (
            <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-600">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                placeholder="your@email.com"
                className="rounded border p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
