"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mountain } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#11203a]">
            <Mountain className="h-6 w-6 text-[#3fa9e0]" strokeWidth={2.5} />
            YourSkiSeason
          </Link>
          <p className="mt-2 text-sm text-[#5b6472]">Set a new password</p>
        </div>

        <div className="rounded-2xl border border-[#e3ddd0] bg-white p-8">

          {success ? (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
              Password updated! Redirecting you to log in...
            </p>
          ) : (
            <>
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-[#11203a]">New password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleUpdate()}
                  className="w-full rounded-xl border border-[#e3ddd0] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
                />
              </div>

              {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full rounded-full bg-[#3fa9e0] py-3.5 font-semibold text-white transition-colors hover:bg-[#2c8bbd] disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}