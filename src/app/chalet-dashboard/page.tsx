"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mountain, LogOut, MapPin, Calendar, Briefcase, Search, Star, MessageSquare } from "lucide-react";

const tabs = ["Overview", "Skills", "Education", "About You", "Availability"];

export default function ChaletDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const accountType = user.user_metadata?.account_type;
      if (accountType !== "chalet") { router.push("/dashboard"); return; }
      setUser(user);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("approved", true);

      setProfiles(profiles || []);
      setLoading(false);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const markStatus = async (profileId: string, status: string) => {
    await supabase.from("reviews").upsert({
      chalet_id: user.id,
      profile_id: profileId,
      status,
    });
    if (status === "interested") setReviewed(r => [...r, profileId]);
    setSelected(null);
  };

  const filtered = profiles.filter(p => {
    const matchesSearch = search === "" ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (p.resort || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (p.roles || []).includes(filter);
    return matchesSearch && matchesFilter;
  });

  const roleFilters = ["all", "Chalet Host", "Chalet Chef", "Lift Operator", "Resort Rep", "Ski Tech"];

  const age = (dob: string) => {
    if (!dob) return "";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
      <p className="text-[#5b6472]">Loading candidates...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb]">

      {/* Top bar */}
      <div className="border-b border-[#dde1ea] bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-[#11203a]">
          <Mountain className="h-5 w-5 text-[#3fa9e0]" strokeWidth={2.5} />
          SeasonAir — Chalet Portal
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5b6472]">{user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#5b6472] hover:text-[#11203a]">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#11203a]">
            Find your next seasonaire
          </h1>
          <p className="mt-2 text-[#5b6472]">
            {profiles.length} available candidates · {reviewed.length} on your review list
          </p>
        </div>

        {/* Search + filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8d95a3]" />
            <input
              type="text"
              placeholder="Search by name or resort..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#dde1ea] bg-white pl-10 pr-4 py-2.5 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {roleFilters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filter === f
                  ? "border-[#3fa9e0] bg-[#3fa9e0]/10 text-[#3fa9e0]"
                  : "border-[#dde1ea] bg-white text-[#5b6472] hover:border-[#3fa9e0]"}`}
              >
                {f === "all" ? "All roles" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Profile cards grid */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#dde1ea] bg-white p-12 text-center">
            <p className="text-[#5b6472]">No candidates match your search.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(profile => (
              <div key={profile.id} className={`rounded-2xl border bg-white p-6 transition-all ${reviewed.includes(profile.id) ? "border-[#3fa9e0] ring-2 ring-[#3fa9e0]/20" : "border-[#dde1ea] hover:border-[#3fa9e0] hover:shadow-lg"}`}>

                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3fa9e0] to-[#11203a] font-display text-lg font-semibold text-white">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[#11203a]">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-xs text-[#8d95a3]">
                      {age(profile.dob) && `${age(profile.dob)} · `}{profile.nationality}
                    </p>
                  </div>
                  {reviewed.includes(profile.id) && (
                    <span className="ml-auto rounded-full bg-[#3fa9e0]/10 px-2.5 py-1 font-mono text-[10px] uppercase text-[#3fa9e0]">
                      On review
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm text-[#5b6472]">
                  {profile.resort && (
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#3fa9e0]" />{profile.resort}</div>
                  )}
                  {profile.start_date && (
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#3fa9e0]" />{profile.start_date} → {profile.end_date}</div>
                  )}
                  {profile.roles?.length > 0 && (
                    <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-[#3fa9e0]" />{profile.roles.slice(0, 2).join(", ")}</div>
                  )}
                </div>

                <button
                  onClick={() => { setSelected(profile); setActiveTab("Overview"); }}
                  className="mt-5 w-full rounded-full bg-[#3fa9e0] py-2.5 text-sm font-semibold text-white hover:bg-[#2c8bbd] transition-colors"
                >
                  View profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full profile modal — Camp Canada style with tabs */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white flex flex-col" onClick={e => e.stopPropagation()}>

            {/* Header with photo + actions */}
            <div className="border-b border-[#dde1ea] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#3fa9e0] to-[#11203a] font-display text-2xl font-semibold text-white">
                    {selected.first_name?.[0]}{selected.last_name?.[0]}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[#11203a]">
                      {selected.first_name} {selected.last_name}
                    </h2>
                    <p className="text-sm text-[#5b6472]">
                      {age(selected.dob) && `${age(selected.dob)} · `}{selected.nationality}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => markStatus(selected.id, "interested")}
                        className="flex items-center gap-1.5 rounded-full bg-[#3fa9e0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2c8bbd]"
                      >
                        <Star className="h-4 w-4" /> Add to review
                      </button>
                      <button
                        onClick={() => markStatus(selected.id, "interview")}
                        className="flex items-center gap-1.5 rounded-full border border-[#3fa9e0] px-4 py-2 text-sm font-semibold text-[#3fa9e0] hover:bg-[#3fa9e0]/10"
                      >
                        <MessageSquare className="h-4 w-4" /> Schedule interview
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-[#8d95a3] hover:text-[#11203a] text-2xl">✕</button>
              </div>
            </div>

            {/* Body with sidebar tabs */}
            <div className="flex flex-1 overflow-hidden">

              {/* Tab sidebar */}
              <div className="w-48 shrink-0 border-r border-[#dde1ea] bg-[#f7f8fb] p-3">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === tab ? "bg-white text-[#3fa9e0] shadow-sm" : "text-[#5b6472] hover:bg-white/50"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-6">

                {activeTab === "Overview" && (
                  <div className="space-y-5 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#f7f8fb] p-4">
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Available</p>
                        <p className="mt-1 font-medium text-[#11203a]">{selected.start_date} → {selected.end_date}</p>
                      </div>
                      <div className="rounded-xl bg-[#f7f8fb] p-4">
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Resort preference</p>
                        <p className="mt-1 font-medium text-[#11203a]">{selected.resort || "No preference"}</p>
                      </div>
                    </div>
                    {selected.roles?.length > 0 && (
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-2">Roles</p>
                        <div className="flex flex-wrap gap-2">
                          {selected.roles.map((r: string) => (
                            <span key={r} className="rounded-full bg-[#3fa9e0]/10 px-3 py-1 text-xs font-medium text-[#3fa9e0]">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "Skills" && (
                  <div className="space-y-4 text-sm">
                    {selected.skills ? <p className="text-[#5b6472] leading-relaxed">{selected.skills}</p> : <p className="text-[#8d95a3]">No skills listed.</p>}
                    {selected.has_driving === "Yes" && <p className="text-[#5b6472]">✓ Full driving licence</p>}
                    {selected.has_language === "Yes" && selected.language_details && <p className="text-[#5b6472]">✓ Languages: {selected.language_details}</p>}
                    {selected.has_hospitality === "Yes" && <p className="text-[#5b6472]">✓ Hospitality experience{selected.hospitality_details ? `: ${selected.hospitality_details}` : ""}</p>}
                  </div>
                )}

                {activeTab === "Education" && (
                  <div className="space-y-3 text-sm">
                    {selected.university ? (
                      <>
                        <p className="text-[#11203a] font-medium">{selected.degree}</p>
                        <p className="text-[#5b6472]">{selected.university} · {selected.grad_year}</p>
                      </>
                    ) : <p className="text-[#8d95a3]">No education listed.</p>}
                    {selected.other_education && <p className="text-[#5b6472]">{selected.other_education}</p>}
                  </div>
                )}

                {activeTab === "About You" && (
                  <div className="space-y-4 text-sm">
                    {selected.why_season && (
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-2">Why they want a season</p>
                        <p className="text-[#5b6472] leading-relaxed">{selected.why_season}</p>
                      </div>
                    )}
                    {selected.motivation && (
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-2">More about them</p>
                        <p className="text-[#5b6472] leading-relaxed">{selected.motivation}</p>
                      </div>
                    )}
                    {selected.video_url && (
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-2">Video introduction</p>
                        <a href={selected.video_url} target="_blank" className="text-[#3fa9e0] underline">Watch video →</a>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "Availability" && (
                  <div className="space-y-3 text-sm">
                    <p className="text-[#5b6472]"><span className="font-medium text-[#11203a]">From:</span> {selected.start_date}</p>
                    <p className="text-[#5b6472]"><span className="font-medium text-[#11203a]">Until:</span> {selected.end_date}</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}