"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mountain } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a link to reset your password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#11203a]">
            <Mountain className="h-6 w-6 text-[#3fa9e0]" strokeWidth={2.5} />
            YourSkiSeason
          </Link>
          <p className="mt-2 text-sm text-[#5b6472]">Reset your password</p>
        </div>

        <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">

          <p className="mb-5 text-sm text-[#5b6472]">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Email address</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleReset()}
              className="w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
            />
          </div>

          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
          {message && <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">{message}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full rounded-full bg-[#3fa9e0] py-3.5 font-semibold text-white transition-colors hover:bg-[#2c8bbd] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <p className="mt-6 text-center text-sm text-[#5b6472]">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-[#3fa9e0] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}