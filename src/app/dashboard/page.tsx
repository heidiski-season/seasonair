"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mountain, CheckCircle, Circle, LogOut, User,
  Home as HomeIcon, ChevronDown, ChevronUp, FolderOpen,
  CalendarClock, HelpCircle, Settings as SettingsIcon,
} from "lucide-react";

const profileSections = [
  { id: "basic", label: "Basic Information" },
  { id: "emergency", label: "Emergency Contact" },
  { id: "availability", label: "Availability" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills & Experience" },
  { id: "role", label: "Role Preference" },
  { id: "motivation", label: "About You" },
];

const requiredSections = [...profileSections, { id: "showcase", label: "Showcase" }];

const documentTypes = [
  { id: "flight_itinerary", label: "Flight Itinerary" },
  { id: "passport", label: "Passport" },
  { id: "police_check", label: "Police Check" },
  { id: "program_agreement", label: "Program Agreement" },
  { id: "qualification_agreement", label: "Qualification Agreement" },
];

const timeSlotOptions = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("overview");
  const [profileOpen, setProfileOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slotPickerDate, setSlotPickerDate] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", dob: "", nationality: "",
    emergency_name: "", emergency_relationship: "", emergency_phone: "",
    start_date: "", end_date: "",
    university: "", degree: "", grad_year: "", other_education: "",
    has_hospitality: "", hospitality_details: "",
    has_driving: "", driving_details: "",
    has_language: "", language_details: "",
    skills: "", roles: [] as string[],
    resort: "", why_season: "", motivation: "",
    video_url: "", photo_url: "",
    documents: {} as Record<string, { url: string; status: string }>,
    interview_availability: [] as { date: string; time: string }[],
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

  // Moves to the next Profile section in order, or back to Home if this was the last one
  const goToNextSection = () => {
    const order = profileSections.map(s => s.id);
    const idx = order.indexOf(active);
    if (idx !== -1 && idx < order.length - 1) {
      setActive(order[idx + 1]);
    } else {
      setActive("overview");
    }
  };

  const saveAndContinue = async () => {
    await saveProfile();
    goToNextSection();
  };

  const uploadDocument = async (docId: string, file: File) => {
    const fileName = `${user.id}-${docId}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documents").upload(fileName, file);
    if (error) { alert("Upload failed: " + error.message); return; }
    const { data } = supabase.storage.from("documents").getPublicUrl(fileName);
    const updatedDocs = { ...form.documents, [docId]: { url: data.publicUrl, status: "uploaded" } };
    setForm(f => ({ ...f, documents: updatedDocs }));
    await supabase.from("profiles").upsert({ id: user.id, ...form, documents: updatedDocs });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const completedSections = requiredSections.filter(s => {
    if (s.id === "basic") return form.first_name && form.last_name && form.email && form.dob && form.nationality && form.photo_url;
    if (s.id === "emergency") return form.emergency_name && form.emergency_phone;
    if (s.id === "availability") return form.start_date && form.end_date;
    if (s.id === "education") return form.university && form.degree && form.grad_year;
    if (s.id === "skills") return form.skills && form.has_driving && form.has_language;
    if (s.id === "role") return form.roles.length > 0;
    if (s.id === "motivation") return form.why_season && form.motivation;
    if (s.id === "showcase") return form.video_url !== "";
    return false;
  });

  const ic = "w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20";
  const lc = "mb-1.5 block text-sm font-medium text-[#11203a]";
  const saveBtn = "mt-6 rounded-full bg-[#3fa9e0] px-8 py-3 font-semibold text-white hover:bg-[#2c8bbd] transition-colors";
  const continueBtn = "mt-6 rounded-full border border-[#3fa9e0] px-8 py-3 font-semibold text-[#3fa9e0] hover:bg-[#3fa9e0]/10 transition-colors";

  const roles = ["Chalet Host", "Driver", "Cleaner", "Chef"];

  if (loading) return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
      <p className="text-[#5b6472]">Loading your dashboard...</p>
    </div>
  );

  const navItemClass = (id: string) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
      active === id ? "bg-[#3fa9e0]/10 text-[#3fa9e0]" : "text-[#5b6472] hover:bg-[#f7f8fb]"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f8fb]">

      <div className="border-b border-[#dde1ea] bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-[#11203a]">
          <Mountain className="h-5 w-5 text-[#3fa9e0]" strokeWidth={2.5} />
          YourSkiSeason Dashboard
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

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-2xl border border-[#dde1ea] bg-white p-4">

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
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#8d95a3]">
                {completedSections.length}/{requiredSections.length} complete
              </p>
            </div>

            <nav className="space-y-1">
              <button onClick={() => setActive("overview")} className={navItemClass("overview")}>
                <HomeIcon className="h-4 w-4 shrink-0" />
                Home
              </button>

              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#5b6472] hover:bg-[#f7f8fb]"
              >
                <span className="flex items-center gap-3">
                  <User className="h-4 w-4 shrink-0" />
                  Profile
                </span>
                {profileOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {profileOpen && (
                <div className="ml-4 space-y-1 border-l border-[#dde1ea] pl-3">
                  {profileSections.map(s => (
                    <button key={s.id} onClick={() => setActive(s.id)} className={navItemClass(s.id)}>
                      {completedSections.find(c => c.id === s.id) ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-[#3fa9e0]" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-[#dde1ea]" />
                      )}
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => setActive("interview")} className={navItemClass("interview")}>
                <CalendarClock className="h-4 w-4 shrink-0" />
                Interview Availability
              </button>

              <button onClick={() => setActive("documents")} className={navItemClass("documents")}>
                <FolderOpen className="h-4 w-4 shrink-0" />
                Documents
              </button>

              <div className="my-2 border-t border-[#dde1ea]" />

              <button onClick={() => setActive("help")} className={navItemClass("help")}>
                <HelpCircle className="h-4 w-4 shrink-0" />
                Help & Information
              </button>
              <button onClick={() => setActive("settings")} className={navItemClass("settings")}>
                <SettingsIcon className="h-4 w-4 shrink-0" />
                Settings
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          {active === "overview" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">
                Welcome back{form.first_name ? `, ${form.first_name}` : ""}! 👋
              </h1>
              <p className="mt-2 text-sm text-[#5b6472]">
                Complete your profile so we can match you to the perfect season.
              </p>

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
                  Fill in as much as you can — your progress saves automatically, so you can log out and come back anytime. All sections must be complete before you can submit. You can keep editing even after submitting.
                </p>
              </div>

              <div className="mt-8 border-t border-[#dde1ea] pt-6">
                <h2 className="font-display text-lg font-semibold text-[#11203a]">Showcase</h2>
                <p className="mt-1 text-sm text-[#5b6472]">Optional — but strongly recommended.</p>

                <div className="mt-4">
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
                          await supabase.from("profiles").upsert({ id: user.id, ...form, video_url: data.publicUrl });
                        }}
                      />
                    </label>
                    <p className="mt-1 text-xs text-[#8d95a3]">Your video is private — only the YourSkiSeason team and matched chalets will see it.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-[#dde1ea] pt-6 sm:flex-row sm:items-center">
                <button
                  onClick={async () => {
                    if (completedSections.length < requiredSections.length) {
                      alert("Please complete all sections before submitting.");
                      return;
                    }
                    await supabase.from("profiles").upsert({ id: user.id, ...form, status: "submitted" });
                    setProfile({ ...profile, status: "submitted" });
                    alert("Application submitted! You can still edit your profile anytime.");
                  }}
                  disabled={completedSections.length < requiredSections.length}
                  className={`rounded-full px-8 py-3 font-semibold text-white transition-colors ${
                    completedSections.length < requiredSections.length
                      ? "bg-[#dde1ea] text-[#8d95a3] cursor-not-allowed"
                      : "bg-[#3fa9e0] hover:bg-[#2c8bbd]"
                  }`}
                >
                  {profile?.status === "submitted" ? "Update my application" : "Submit application 🎿"}
                </button>
                <p className="text-xs text-[#8d95a3]">
                  {profile?.status === "submitted"
                    ? "✓ Submitted — you can keep editing"
                    : completedSections.length < requiredSections.length
                    ? `Complete all sections to submit (${completedSections.length}/${requiredSections.length} done)`
                    : "All sections complete — ready to submit"}
                </p>
              </div>
            </div>
          )}

          {active === "basic" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Basic Information</h1>

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

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label className={lc}>Email *</label><input type="email" value={form.email} onChange={e => update("email", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Phone</label><input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Date of birth *</label><input type="date" value={form.dob} onChange={e => update("dob", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Nationality *</label><input type="text" value={form.nationality} onChange={e => update("nationality", e.target.value)} className={ic} /></div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and continue →</button>
              </div>
            </div>
          )}

          {active === "emergency" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Emergency Contact</h1>
              <p className="mt-1 text-sm text-[#5b6472]">Who should we contact in case of an emergency during your season?</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label className={lc}>Contact name *</label><input type="text" value={form.emergency_name} onChange={e => update("emergency_name", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Relationship</label><input type="text" value={form.emergency_relationship} onChange={e => update("emergency_relationship", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Phone number *</label><input type="tel" value={form.emergency_phone} onChange={e => update("emergency_phone", e.target.value)} className={ic} /></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and continue →</button>
              </div>
            </div>
          )}

          {active === "availability" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Availability</h1>
              <p className="mt-1 text-sm text-[#5b6472]">These are the season dates you're available to work — not your interview times (see "Interview Availability" in the sidebar for that).</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label className={lc}>Available from</label><input type="date" value={form.start_date} onChange={e => update("start_date", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Available until</label><input type="date" value={form.end_date} onChange={e => update("end_date", e.target.value)} className={ic} /></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and continue →</button>
              </div>
            </div>
          )}

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
              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and continue →</button>
              </div>
            </div>
          )}

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
              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and finish →</button>
              </div>
            </div>
          )}

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
              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and continue →</button>
              </div>
            </div>
          )}

          {active === "education" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Education</h1>
              <div className="mt-6 space-y-5">
                <div><label className={lc}>University name</label><input type="text" value={form.university} onChange={e => update("university", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Degree / Subject</label><input type="text" value={form.degree} onChange={e => update("degree", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Graduation year</label><input type="text" value={form.grad_year} onChange={e => update("grad_year", e.target.value)} className={ic} /></div>
                <div><label className={lc}>Other qualifications</label><textarea rows={3} value={form.other_education} onChange={e => update("other_education", e.target.value)} className={ic} /></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={saveProfile} className={saveBtn}>{saving ? "Saving..." : saved ? "Saved ✓" : "Save"}</button>
                <button onClick={saveAndContinue} className={continueBtn}>Save and continue →</button>
              </div>
            </div>
          )}

          {active === "interview" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Interview Availability</h1>
              <p className="mt-2 text-sm text-[#5b6472]">
                Pick a date, then tap the time slots you're free for a call. Chalet companies will book you into one of these.
              </p>

              <div className="mt-6">
                <label className={lc}>Date</label>
                <input
                  type="date"
                  value={slotPickerDate}
                  onChange={e => setSlotPickerDate(e.target.value)}
                  className={`${ic} max-w-xs`}
                />
              </div>

              {slotPickerDate && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-[#11203a]">Available time slots</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {timeSlotOptions.map((time) => {
                      const isSelected = (form.interview_availability || []).some(
                        (s: any) => s.date === slotPickerDate && s.time === time
                      );
                      return (
                        <button
                          key={time}
                          onClick={async () => {
                            const exists = (form.interview_availability || []).some(
                              (s: any) => s.date === slotPickerDate && s.time === time
                            );
                            const updated = exists
                              ? form.interview_availability.filter(
                                  (s: any) => !(s.date === slotPickerDate && s.time === time)
                                )
                              : [...(form.interview_availability || []), { date: slotPickerDate, time }];
                            setForm(f => ({ ...f, interview_availability: updated }));
                            await supabase.from("profiles").upsert({ id: user.id, ...form, interview_availability: updated });
                          }}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                            isSelected
                              ? "border-[#3fa9e0] bg-[#3fa9e0] text-white"
                              : "border-[#dde1ea] text-[#5b6472] hover:border-[#3fa9e0]"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 border-t border-[#dde1ea] pt-6">
                <p className="mb-3 text-sm font-medium text-[#11203a]">Your selected slots</p>
                {(!form.interview_availability || form.interview_availability.length === 0) ? (
                  <p className="rounded-xl bg-[#f7f8fb] p-5 text-sm text-[#5b6472]">
                    You haven't added any interview slots yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(
                      (form.interview_availability as { date: string; time: string }[]).reduce(
                        (groups: Record<string, string[]>, slot) => {
                          groups[slot.date] = groups[slot.date] || [];
                          groups[slot.date].push(slot.time);
                          return groups;
                        },
                        {}
                      )
                    )
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, times]) => (
                        <div key={date} className="rounded-xl border border-[#dde1ea] p-4">
                          <p className="text-sm font-semibold text-[#11203a]">
                            {new Date(date + "T00:00").toLocaleDateString("en-GB", {
                              weekday: "long", day: "numeric", month: "long",
                            })}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {times.sort().map((time) => (
                              <span
                                key={time}
                                className="flex items-center gap-2 rounded-full bg-[#3fa9e0]/10 px-3 py-1 text-xs font-medium text-[#3fa9e0]"
                              >
                                {time}
                                <button
                                  onClick={async () => {
                                    const updated = form.interview_availability.filter(
                                      (s: any) => !(s.date === date && s.time === time)
                                    );
                                    setForm(f => ({ ...f, interview_availability: updated }));
                                    await supabase.from("profiles").upsert({ id: user.id, ...form, interview_availability: updated });
                                  }}
                                  className="text-[#3fa9e0] hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {active === "documents" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Documents</h1>

              {profile?.status === "matched" || profile?.status === "hired" ? (
                <>
                  <p className="mt-2 text-sm text-[#5b6472]">
                    These are the documents you need to upload to complete your application. All files must be
                    2MB or less and be a JPEG or PDF.
                  </p>

                  <div className="mt-6 divide-y divide-[#dde1ea] rounded-xl border border-[#dde1ea]">
                    {documentTypes.map((docType) => {
                      const doc = form.documents?.[docType.id];
                      const status = doc?.status || "not_started";

                      return (
                        <div key={docType.id} className="flex items-center justify-between gap-4 p-4">
                          <div>
                            <p className="text-sm font-medium text-[#11203a]">{docType.label}</p>
                            <span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-medium ${
                              status === "uploaded" ? "text-green-600" : "text-[#8d95a3]"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                status === "uploaded" ? "bg-green-500" : "bg-[#dde1ea]"
                              }`} />
                              {status === "uploaded" ? "Uploaded — pending review" : "Not started"}
                            </span>
                          </div>

                          <label className="cursor-pointer shrink-0 rounded-full border border-[#3fa9e0] px-4 py-2 text-sm font-medium text-[#3fa9e0] hover:bg-[#3fa9e0]/10 transition-colors">
                            {doc?.url ? "Replace" : "Upload"}
                            <input
                              type="file"
                              accept="image/jpeg,application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 2 * 1024 * 1024) {
                                  alert("File must be 2MB or less.");
                                  return;
                                }
                                uploadDocument(docType.id, file);
                              }}
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-[#dde1ea] bg-[#f7f8fb] py-12 text-center">
                  <svg className="h-10 w-10 text-[#8d95a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-[#11203a]">Documents will unlock once you're hired</p>
                  <p className="mt-1 max-w-sm text-sm text-[#5b6472]">
                    Once a chalet company hires you, this section will open up so you can upload your Flight Itinerary, Passport, Police Check, and agreements.
                  </p>
                </div>
              )}
            </div>
          )}

          {active === "help" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Help & Information</h1>
              <p className="mt-2 text-sm text-[#5b6472]">Questions? Email us — details coming soon.</p>
            </div>
          )}

          {active === "settings" && (
            <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
              <h1 className="font-display text-2xl font-semibold text-[#11203a]">Settings</h1>
              <p className="mt-2 text-sm text-[#5b6472]">Account settings coming soon.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}