"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mountain } from "lucide-react";

export default function ChaletSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [resort, setResort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    // Create auth account
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { account_type: "chalet" },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Save company details
    await supabase.from("chalet_companies").insert({
      id: data.user?.id,
      company_name: companyName,
      contact_name: contactName,
      email,
      phone,
      resort,
      approved: false,
    });

    setSubmitted(true);
    setLoading(false);
  };

  const ic = "w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20";
  const lc = "mb-1.5 block text-sm font-medium text-[#11203a]";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#3fa9e0]/10">
            <Mountain className="h-8 w-8 text-[#3fa9e0]" strokeWidth={2} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#11203a]">
            Application received!
          </h1>
          <p className="mt-3 text-sm text-[#5b6472] leading-relaxed">
            Thanks for registering <strong>{companyName}</strong> with SeasonAir.
            We review all chalet company applications manually to keep our
            seasonaire profiles secure. We'll be in touch at{" "}
            <strong>{email}</strong> within 48 hours.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors"
          >
            Back to SeasonAir
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#11203a]">
            <Mountain className="h-6 w-6 text-[#3fa9e0]" strokeWidth={2.5} />
            SeasonAir
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold text-[#11203a]">
            Register your chalet company
          </h1>
          <p className="mt-2 text-sm text-[#5b6472]">
            We review all chalet company accounts before granting access to seasonaire profiles.
          </p>
        </div>

        <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">

          <div className="space-y-4">
            <div>
              <label className={lc}>Company name *</label>
              <input type="text" placeholder="e.g. Méribel Chalet Co." value={companyName} onChange={e => setCompanyName(e.target.value)} className={ic} />
            </div>
            <div>
              <label className={lc}>Your name *</label>
              <input type="text" placeholder="e.g. James Smith" value={contactName} onChange={e => setContactName(e.target.value)} className={ic} />
            </div>
            <div>
              <label className={lc}>Email address *</label>
              <input type="email" placeholder="james@chaletco.com" value={email} onChange={e => setEmail(e.target.value)} className={ic} />
            </div>
            <div>
              <label className={lc}>Phone number</label>
              <input type="tel" placeholder="+44 7700 000000" value={phone} onChange={e => setPhone(e.target.value)} className={ic} />
            </div>
            <div>
              <label className={lc}>Resort(s) you operate in</label>
              <input type="text" placeholder="e.g. Méribel, Courchevel" value={resort} onChange={e => setResort(e.target.value)} className={ic} />
            </div>
            <div>
              <label className={lc}>Password *</label>
              <input type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} className={ic} />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-4 rounded-xl bg-[#f7f8fb] p-4 text-xs text-[#5b6472]">
            ℹ️ Your account will be reviewed by the SeasonAir team before you can access seasonaire profiles. This usually takes less than 48 hours.
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-[#3fa9e0] py-3.5 font-semibold text-white transition-colors hover:bg-[#2c8bbd] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Register company →"}
          </button>

          <p className="mt-6 text-center text-sm text-[#5b6472]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#3fa9e0] hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#5b6472]">
          Are you a seasonaire?{" "}
          <Link href="/signup" className="font-semibold text-[#3fa9e0] hover:underline">
            Apply here instead
          </Link>
        </p>

      </div>
    </div>
  );
}