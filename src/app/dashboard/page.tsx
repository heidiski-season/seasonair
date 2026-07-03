"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mountain, CheckCircle, Circle, LogOut, User } from "lucide-react";

const sections = [
  { id: "basic", label: "Basic Information" },
  { id: "availability", label: "Availability" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills & Experience" },
  { id: "role", label: "Role Preference" },  
  { id: "motivation", label: "About You" },
  { id: "showcase", label: "Showcase" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", dob: "", nationality: "",
    start_date: "", end_date: "",
    university: "", degree: "", grad_year: "", other_education: "",
    has_hospitality: "", hospitality_details: "",
    has_driving: "", driving_details: "",
    has_language: "", language_details: "",
    skills: "", roles: [] as string[],
    resort: "", why_season: "", motivation: "",
    video_url: "", photo_url: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setForm({ ...form, ...profile });
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const update = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const toggleRole = (role: string) =>
    setForm(f => ({
      ...f,
      roles: f.roles.includes(role)
        ? f.roles.filter(r => r !== role)
        : [...f.roles, role],
    }));

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...form });
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

const completedSections = sections.filter(s => {
    if (s.id === "basic") return form.first_name && form.email;
    if (s.id === "availability") return form.start_date && form.end_date;
    if (s.id === "education") return form.university || form.other_education;
    if (s.id === "skills") return form.skills || form.has_driving || form.has_language;
    if (s.id === "role") return form.roles.length > 0;
    if (s.id === "motivation") return form.why_season !== "";
    if (s.id === "showcase") return form.video_url !== "";
    return false;
  });

  const ic = "w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20";
  const lc = "mb-1.5 block text-sm font-medium text-[#11203a]";

  const roles = ["Chalet Host", "Driver", "Cleaner", "Chef"];
  
  if (loading) return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
      <p className="text-[#5b6472]">Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb]">

      {/* Top bar */}
      <div className="border-b border-[#dde1ea] bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-[#11203a]">
          <Mountain className="h-5 w-5 text-[#3fa9e0]" strokeWidth={2.5} />
          SeasonAir
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5b6472]">{user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#5b6472] hover:text-[#11203a]">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 sm:px-6">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-2xl border border-[#dde1ea] bg-white p-4">

            {/* Status badge */}
            <div className="mb-4 rounded-xl bg-[#f7f8fb] p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#3fa9e0]/10">
                <User className="h-6 w-6 text-[#3fa9e0]" />
              </div>
              <p className="font-display font-semibold text-[#11203a]">
                {form.first_name || "Your"} {form.last_name || "Profile"}
              </p>
              <span className={`mt-1 inline-block rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                profile?.status === "matched" ? "bg-green-100 text-green-700" :
                profile?.status === "interview" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {profile?.status || "pending"}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-2 border-t border-[#dde1ea] pt-4">
              <p className="px-3 pb-2 font-mono text-xs uppercase tracking-wider text-[#8d95a3]">
                {completedSections.length}/{sections.length} complete
              </p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActive("overview")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${active === "overview" ? "bg-[#3fa9e0]/10 text-[#3fa9e0]" : "text-[#5b6472] hover:bg-[#f7f8fb]"}`}
              >
                Overview
              </button>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${active === s.id ? "bg-[#3fa9e0]/10 text-[#3fa9e0]" : "text-[#5b6472] hover:bg-[#f7f8fb]"}`}
                >
                  {completedSections.find(c => c.id === s.id) ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#3fa9e0]" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-[#dde1ea]" />
                  )}
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-6">

          {/* Overview */}
          {active === "overview" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">
                Welcome back{form.first_name ? `, ${form.first_name}` : ""}! 👋
              </h1>
              <p className="mt-2 text-sm text-[#5b6472]">
                Complete your profile so we can match you to the perfect season.
              </p>

              {/* Status timeline */}
              <div className="mt-8 grid grid-cols-4 gap-4">
                {["Applied", "Interview", "Matched", "Hired"].map((stage, i) => (
                  <div key={stage} className={`rounded-xl border p-4 text-center text-sm font-medium ${
                    i === 0 ? "border-[#3fa9e0] bg-[#3fa9e0]/10 text-[#3fa9e0]" : "border-[#dde1ea] text-[#8d95a3]"
                  }`}>
                    {stage}
                  </div>
                ))}

              </div>
<div className="mt-8 rounded-xl bg-[#f7f8fb] p-5">
                <p className="text-sm font-medium text-[#11203a]">How this works</p>
                <p className="mt-1 text-sm text-[#5b6472]">
                  Fill in as much as you can — your progress saves automatically, so you can log out and come back anytime. Only your name and a photo are required to submit. You can keep editing even after submitting.
                </p>
              </div>

              {/* Submit button */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={async () => {
                    if (!form.first_name) {
                      alert("Please add your name in Basic Information before submitting.");
                      setActive("basic");
                      return;
                    }
                    await supabase.from("profiles").upsert({ id: user.id, ...form, status: "submitted" });
                    setProfile({ ...profile, status: "submitted" });
                    alert("Application submitted! You can still edit your profile anytime.");
                  }}
                  className="rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors"
                >
                  {profile?.status === "submitted" ? "Update my application" : "Submit application 🎿"}
                </button>
                <p className="text-xs text-[#8d95a3]">
                    {profile?.status === "submitted" ? "✓ Submitted — you can keep editing" : "You can keep editing after submitting"}
                </p>
              </div>
            </div>
          )}

         {/* Basic Info */}
          {active === "basic" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Basic Information</h1>

              {/* Photo + name row */}
              <div className="mt-6 flex items-center gap-6">
                <label className="cursor-pointer shrink-0">
                  <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#3fa9e0]/40 bg-[#f7f8fb] hover:border-[#3fa9e0]">
                    {form.photo_url ? (
                      <img src={form.photo_url} alt="Your photo" className="h-full w-full object-cover" />
                    ) : (
                      <svg className="h-14 w-14 text-[#8d95a3]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <span className="mt-2 block text-center text-xs font-medium text-[#3fa9e0]">
                    {form.photo_url ? "Change" : "Upload photo *"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fileName = `${user.id}-${Date.now()}-${file.name}`;
                      const { error } = await supabase.storage.from("photos").upload(fileName, file);
                      if (error) { alert("Upload failed: " + error.message); return; }
                      const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
                      update("photo_url", data.publicUrl);
                    }}
                  />
                </label>

                <div className="flex-1 space-y-4">
                  <div><label className={lc}>First name *</label><input type="text" value={form.first_name} onChange={e => update("first_name", e.target.value)} className={ic} /></div>
                  <div><label className={lc}>Last name *</label><input type="text" value={form.last_name} onChange={e => update("last_name", e.target.value)} className={ic} /></div>
                </div>
              </div>

              {/* Rest of the info */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label className={lc}>Email *</label><input type="email" value={form.email} onChange={e => update("email", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Phone</label><input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Date of birth *</label><input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Nationality *</label><input type="text" value={form.nationality} onChange={e => update("nationality", e.target.value)} className={ic} /></div>
              </div>

              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
          )}

          {/* Availability */}
          {active === "availability" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Availability</h1>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label className={lc}>Available from</label><input type="date" value={form.start_date} onChange={e => update("start_date", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Available until</label><input type="date" value={form.end_date} onChange={e => update("end_date", e.target.value)} className={ic} /></div>
              </div>
              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
          )}

          {/* Role */}
          {active === "role" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Role Preference</h1>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {roles.map(role => (
                  <label key={role} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-colors ${form.roles.includes(role) ? "border-[#3fa9e0] bg-[#3fa9e0]/10" : "border-[#dde1ea] text-[#5b6472] hover:border-[#3fa9e0]"}`}>
                    <input type="checkbox" checked={form.roles.includes(role)} onChange={() => toggleRole(role)} className="accent-[#3fa9e0]" />
                    {role}
                  </label>
                ))}
              </div>
              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
          )}


          {/* About You */}
          {active === "motivation" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">About You</h1>
              <div className="mt-6 space-y-5">
                <div>
                  <label className={lc}>Why do you want to do a ski season?</label>
                  <textarea rows={4} value={form.why_season} onChange={e => update("why_season", e.target.value)} className={ic} />
                </div>
                <div>
                  <label className={lc}>Anything else you'd like us to know?</label>
                  <textarea rows={4} value={form.motivation} onChange={e => update("motivation", e.target.value)} className={ic} />
                </div>
              </div>
              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
          )}

          {/* Skills */}
          {active === "skills" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Skills & Experience</h1>
              <div className="mt-6 space-y-5">
                <div><label className={lc}>Any relevant experience</label><textarea rows={4} value={form.skills} onChange={e => update("skills", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Driving licence?</label>
                  <div className="flex gap-3 mt-1">
                    {["Yes", "No"].map(opt => (
                      <button key={opt} onClick={() => update("has_driving", opt)} className={`rounded-xl border px-6 py-2.5 text-sm font-medium transition-colors ${form.has_driving === opt ? "border-[#3fa9e0] bg-[#3fa9e0]/10 text-[#3fa9e0]" : "border-[#dde1ea] text-[#5b6472]"}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div><label className={lc}>Languages other than English?</label>
                  <div className="flex gap-3 mt-1">
                    {["Yes", "No"].map(opt => (
                      <button key={opt} onClick={() => update("has_language", opt)} className={`rounded-xl border px-6 py-2.5 text-sm font-medium transition-colors ${form.has_language === opt ? "border-[#3fa9e0] bg-[#3fa9e0]/10 text-[#3fa9e0]" : "border-[#dde1ea] text-[#5b6472]"}`}>{opt}</button>
                    ))}
                  </div>
                  {form.has_language === "Yes" && <input type="text" placeholder="e.g. French (intermediate)" value={form.language_details} onChange={e => update("language_details", e.target.value)} className={`${ic} mt-3`} />}
                </div>
              </div>
              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
          )}

          {/* Education */}
          {active === "education" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Education</h1>
              <div className="mt-6 space-y-5">
                <div><label className={lc}>University name</label><input type="text" value={form.university} onChange={e => update("university", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Degree / Subject</label><input type="text" value={form.degree} onChange={e => update("degree", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Graduation year</label><input type="text" value={form.grad_year} onChange={e => update("grad_year", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Other qualifications</label><textarea rows={3} value={form.other_education} onChange={e => update("other_education", e.target.value)} className={ic} /></div>
              </div>
              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>
            </div>
          )}

          {/* Showcase */}
          {active === "showcase" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Showcase</h1>
              <p className="mt-1 text-sm text-[#5b6472]">Optional — but strongly recommended.</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className={lc}>Video introduction</label>
                  <div className="mt-1.5 rounded-xl border-2 border-dashed border-[#3fa9e0]/40 bg-white p-6 text-center">
                    <label className="cursor-pointer">
                      {form.video_url ? (
                        <div>
                          <video src={form.video_url} controls className="mx-auto max-h-64 rounded-xl" />
                          <p className="mt-3 text-sm font-medium text-[#3fa9e0]">✓ Uploaded — click to replace</p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-[#11203a]">Click to upload a video</p>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fileName = `${user.id}-${Date.now()}-${file.name}`;
                          const { error } = await supabase.storage.from("videos").upload(fileName, file);
                          if (error) { alert("Upload failed: " + error.message); return; }
                          const { data } = supabase.storage.from("videos").getPublicUrl(fileName);
                          update("video_url", data.publicUrl);
                        }}
                      />
                    </label>
                    <p className="mt-1 text-xs text-[#8d95a3]">Your video is private — only the SeasonAir team and matched chalets will see it.</p>
                  </div>
                </div>
                <div><label className={lc}>Photo portfolio link</label><input type="url" placeholder="https://..." value={form.photo_url} onChange={e => update("photo_url", e.target.value)} className={ic} /></div>
              </div>
              <button onClick={saveProfile} className="mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors">
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
              </button>

{/* Final submit */}
              <div className="mt-8 border-t border-[#dde1ea] pt-6">
                {profile?.status === "submitted" ? (
                  <div className="rounded-xl bg-green-50 p-5 text-center">
                    <p className="font-semibold text-green-700">✓ Application submitted</p>
                    <p className="mt-1 text-sm text-green-600">
                      Your application is now locked and with our team. We'll be in touch soon!
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-[#5b6472]">
                      Ready to submit? Once you submit, your application is final and can't be changed — so double-check everything first.
                    </p>
                    <button
                      onClick={async () => {
                        if (!form.first_name || !form.photo_url) {
                          alert("Please add your name and a photo in Basic Information before submitting.");
                          setActive("basic");
                          return;
                        }
                        if (!confirm("Submit your application? You won't be able to make changes after this.")) return;
                        await supabase.from("profiles").upsert({ id: user.id, ...form, status: "submitted" });
                        setProfile({ ...profile, status: "submitted" });
                        alert("Application submitted! Good luck 🎿");
                      }}
                      className="rounded-full bg-[#11203a] px-10 py-3.5 font-semibold text-white hover:bg-[#1b2f54] transition-colors"
                    >
                      Submit application 🎿
                    </button>
                  </>
                )}
              </div>