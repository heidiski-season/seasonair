"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mountain } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: "YourSkiSeason",
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#11203a]">
            <Mountain className="h-6 w-6 text-[#3fa9e0]" strokeWidth={2.5} />
            YourSkiSeason
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold text-[#11203a]">
            Start your season application
          </h1>
          <p className="mt-2 text-sm text-[#5b6472]">
            Create your account and we'll guide you through the rest.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e3ddd0] bg-white p-8">

          {/* Name */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#11203a]">First name</label>
              <input
                type="text"
                placeholder="Heidi"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-[#e3ddd0] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Last name</label>
              <input
                type="text"
                placeholder="Warren"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full rounded-xl border border-[#e3ddd0] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Email address</label>
            <input
              type="email"
              placeholder="heidi@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#e3ddd0] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSignup()}
              className="w-full rounded-xl border border-[#e3ddd0] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-full bg-[#3fa9e0] py-3.5 font-semibold text-white transition-colors hover:bg-[#2c8bbd] disabled:opacity-50"
          >
            {loading ? "Creating your account..." : "Start my application →"}
          </button>

          <p className="mt-4 text-center text-xs text-[#8d95a3]">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[#11203a]">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-[#11203a]">Privacy Policy</Link>.
          </p>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-[#5b6472]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#3fa9e0] hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}