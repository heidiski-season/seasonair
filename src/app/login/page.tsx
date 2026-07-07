"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mountain } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const accountType = data.user?.user_metadata?.account_type;

    if (accountType === "chalet") {
      router.push("/chalet-dashboard");
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#11203a]">
            <Mountain className="h-6 w-6 text-[#3fa9e0]" strokeWidth={2.5} />
            YourSkiSeaon
          </Link>
          <p className="mt-2 text-sm text-[#5b6472]">Welcome back</p>
        </div>

        <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">

          {/* Email */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Email address</label>
            <input
              type="email"
              placeholder="heidi@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-full bg-[#3fa9e0] py-3.5 font-semibold text-white transition-colors hover:bg-[#2c8bbd] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
<p className="mb-4 text-right text-sm">
  <Link href="/forgot-password" className="text-[#3fa9e0] hover:underline">
    Forgot password?
  </Link>
</p>
          <p className="mt-6 text-center text-sm text-[#5b6472]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-[#3fa9e0] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}