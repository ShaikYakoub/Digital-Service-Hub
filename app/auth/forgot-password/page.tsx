"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(() => {
      reset({ email }).then((data) => {
        if (data.error) {
          setMessage({ type: "error", text: data.error });
        } else if (data.success) {
          setMessage({ type: "success", text: data.success });
        }
      });
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4 rounded-lg border bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

          {message && (
            <div
              className={`rounded border p-3 text-sm ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-600"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              {message.text}
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
                disabled={isPending}
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-black p-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
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
