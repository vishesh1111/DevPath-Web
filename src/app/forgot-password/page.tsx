"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage("Password reset instructions have been sent to your email.");
    } catch (err: any) {
      console.error(err);

      setError(
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : "Failed to send reset email.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border p-6">
        <h1 className="mb-2 text-2xl font-bold">Forgot Password</h1>

        <p className="mb-6 text-sm text-gray-500">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full rounded-lg border p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-white"
          >
            Send Reset Link
          </button>
        </form>

        {message && <p className="mt-4 text-green-500">{message}</p>}

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <Link href="/login" className="mt-4 block text-center text-cyan-500">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
