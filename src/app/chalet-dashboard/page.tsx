"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mountain, LogOut, MapPin, Calendar, Briefcase, Star, MessageSquare,
  Clock, Heart, Home as HomeIcon, Bookmark, ClipboardList,
} from "lucide-react";

const tabs = ["Overview", "Skills", "Education", "About You", "Availability"];

export default function ChaletDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [nav, setNav] = useState<"home" | "watchlist" | "review">("home");
  const [bookingFor, setBookingFor] = useState<any>(null);
  const router = useRouter();
  const feedRef = useRef<HTMLDivElement>(null);

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

      const { data: reviewRows } = await supabase
        .from("reviews")
        .select("*")
        .eq("chalet_id", user.id);

      setProfiles(profiles || []);
      setReviews(reviewRows || []);
      setLoading(false);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getReviewRow = (profileId: string) => reviews.find(r => r.profile_id === profileId);
  const watchlistIds = reviews.filter(r => r.status === "watchlist").map(r => r.profile_id);
  const reviewedIds = reviews.filter(r => r.status === "interested" || r.status === "interview").map(r => r.profile_id);

  const upsertReview = async (profileId: string, status: string, extra: any = {}) => {
    await supabase.from("reviews").upsert({
      chalet_id: user.id,
      profile_id: profileId,
      status,
      ...extra,
    });
    setReviews(r => {
      const existing = r.find(row => row.profile_id === profileId);
      if (existing) {
        return r.map(row => row.profile_id === profileId ? { ...row, status, ...extra } : row);
      }
      return [...r, { chalet_id: user.id, profile_id: profileId, status, ...extra }];
    });
  };

  const toggleWatchlist = async (profileId: string) => {
    if (watchlistIds.includes(profileId)) {
      await supabase.from("reviews").delete().eq("chalet_id", user.id).eq("profile_id", profileId);
      setReviews(r => r.filter(row => row.profile_id !== profileId));
    } else {
      await upsertReview(profileId, "watchlist");
    }
  };

  const markStatus = async (profileId: string, status: string) => {
    await upsertReview(profileId, status);
    setSelected(null);
  };

  const bookSlot = async (profileId: string, slot: { date: string; time: string }) => {
  await upsertReview(profileId, "interview", { booked_slot: slot });

  const profile = profiles.find(p => p.id === profileId);
  const { data: chaletData } = await supabase
    .from("chalet_companies")
    .select("company_name")
    .eq("id", user.id)
    .single();

  if (profile?.email) {
    fetch("/api/send-interview-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonaireEmail: profile.email,
        seasonaireName: profile.first_name,
        chaletName: chaletData?.company_name || "A chalet company",
        date: slot.date,
        time: slot.time,
      }),
    }).catch(err => console.error("Email send failed:", err));
  }

  setBookingFor(null);
};

  const watchlistCandidates = profiles.filter(p => watchlistIds.includes(p.id));
  const reviewCandidates = profiles.filter(p => reviewedIds.includes(p.id));

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

  const navItemClass = (id: string) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
      nav === id ? "bg-[#3fa9e0]/10 text-[#3fa9e0]" : "text-[#5b6472] hover:bg-[#f7f8fb]"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f8fb]">

      {/* Top bar */}
      <div className="border-b border-[#dde1ea] bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-[#11203a]">
          <Mountain className="h-5 w-5 text-[#3fa9e0]" strokeWidth={2.5} />
          YourSkiSeason — Chalet Portal
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5b6472]">{user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#5b6472] hover:text-[#11203a]">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-2xl border border-[#dde1ea] bg-white p-4">
            <nav className="space-y-1">
              <button onClick={() => setNav("home")} className={navItemClass("home")}>
                <HomeIcon className="h-4 w-4 shrink-0" />
                Home
              </button>
              <button onClick={() => setNav("watchlist")} className={navItemClass("watchlist")}>
                <Bookmark className="h-4 w-4 shrink-0" />
                Watchlist ({watchlistIds.length})
              </button>
              <button onClick={() => setNav("review")} className={navItemClass("review")}>
                <ClipboardList className="h-4 w-4 shrink-0" />
                Review ({reviewedIds.length})
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">

          {nav === "home" && (
            <div>
              <div className="mb-4">
                <h1 className="font-display text-2xl font-semibold text-[#11203a]">Discover</h1>
                <p className="mt-1 text-sm text-[#5b6472]">Scroll to see all {profiles.length} candidates. Tap the heart to save to your watchlist.</p>
              </div>

              {profiles.length === 0 ? (
                <div className="rounded-2xl border border-[#dde1ea] bg-white p-12 text-center">
                  <p className="text-[#5b6472]">No candidates available yet.</p>
                </div>
              ) : (
                <div
                  ref={feedRef}
                  className="h-[calc(100vh-220px)] max-w-md mx-auto overflow-y-scroll snap-y snap-mandatory rounded-3xl border border-[#dde1ea] bg-black shadow-xl"
                >
                  {profiles.map(profile => (
                    <div
                      key={profile.id}
                      className="relative h-[calc(100vh-220px)] w-full snap-start snap-always overflow-hidden"
                    >
                      {/* Background photo or gradient fallback */}
                      {profile.photo_url ? (
                        <img
                          src={profile.photo_url}
                          alt={profile.first_name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3fa9e0] to-[#11203a]">
                          <span className="font-display text-6xl font-semibold text-white/80">
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                          </span>
                        </div>
                      )}

                      {/* Gradient overlay for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                      {/* Heart / watchlist button */}
                      <button
                        onClick={() => toggleWatchlist(profile.id)}
                        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
                      >
                        <Heart
                          className={`h-6 w-6 ${watchlistIds.includes(profile.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                        />
                      </button>

                      {/* Info block, tap to open full profile */}
                      <button
                        onClick={() => { setSelected(profile); setActiveTab("Overview"); }}
                        className="absolute inset-x-0 bottom-0 p-6 text-left"
                      >
                        <h2 className="font-display text-2xl font-semibold text-white">
                          {profile.first_name} {profile.last_name}
                          {age(profile.dob) && <span className="ml-2 font-normal text-white/80">{age(profile.dob)}</span>}
                        </h2>
                        <p className="mt-1 text-sm text-white/70">{profile.nationality}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {profile.roles?.slice(0, 3).map((r: string) => (
                            <span key={r} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              {r}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs text-white/70">
                          {profile.resort && (
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.resort}</span>
                          )}
                          {profile.full_season ? (
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Full season</span>
                          ) : profile.start_date && (
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{profile.start_date}</span>
                          )}
                        </div>

                        <p className="mt-3 text-xs font-medium text-white/60">Tap to view full profile →</p>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {nav === "watchlist" && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-semibold text-[#11203a]">Watchlist</h1>
                <p className="mt-1 text-sm text-[#5b6472]">Candidates you've saved but haven't added to review yet.</p>
              </div>
              {watchlistCandidates.length === 0 ? (
                <div className="rounded-2xl border border-[#dde1ea] bg-white p-12 text-center">
                  <p className="text-[#5b6472]">Nothing here yet — tap the heart on Home to save candidates.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {watchlistCandidates.map(profile => (
                    <div key={profile.id} className="rounded-2xl border border-[#dde1ea] bg-white p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3fa9e0] to-[#11203a] font-display text-lg font-semibold text-white">
                          {profile.first_name?.[0]}{profile.last_name?.[0]}
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-[#11203a]">{profile.first_name} {profile.last_name}</h3>
                          <p className="text-xs text-[#8d95a3]">{age(profile.dob) && `${age(profile.dob)} · `}{profile.nationality}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => { setSelected(profile); setActiveTab("Overview"); }}
                          className="flex-1 rounded-full border border-[#dde1ea] py-2.5 text-sm font-semibold text-[#5b6472] hover:border-[#3fa9e0] transition-colors"
                        >
                          View profile
                        </button>
                        <button
                          onClick={() => markStatus(profile.id, "interested")}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#3fa9e0] py-2.5 text-sm font-semibold text-white hover:bg-[#2c8bbd] transition-colors"
                        >
                          <Star className="h-4 w-4" /> Add to review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {nav === "review" && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-2xl font-semibold text-[#11203a]">Review</h1>
                <p className="mt-1 text-sm text-[#5b6472]">Candidates you're seriously interested in.</p>
              </div>
              {reviewCandidates.length === 0 ? (
                <div className="rounded-2xl border border-[#dde1ea] bg-white p-12 text-center">
                  <p className="text-[#5b6472]">You haven't added anyone to review yet.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {reviewCandidates.map(profile => {
                    const row = getReviewRow(profile.id);
                    const bookedSlot = row?.booked_slot;

                    return (
                      <div key={profile.id} className="rounded-2xl border border-[#3fa9e0] ring-2 ring-[#3fa9e0]/20 bg-white p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3fa9e0] to-[#11203a] font-display text-lg font-semibold text-white">
                            {profile.first_name?.[0]}{profile.last_name?.[0]}
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-[#11203a]">{profile.first_name} {profile.last_name}</h3>
                            <p className="text-xs text-[#8d95a3]">{age(profile.dob) && `${age(profile.dob)} · `}{profile.nationality}</p>
                          </div>
                          <span className={`ml-auto rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                            row?.status === "interview" ? "bg-blue-100 text-blue-700" : "bg-[#3fa9e0]/10 text-[#3fa9e0]"
                          }`}>
                            {row?.status === "interview" ? "Interview booked" : "On review"}
                          </span>
                        </div>

                        {bookedSlot ? (
                          <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                            <span className="font-medium">Booked:</span>{" "}
                            {new Date(bookedSlot.date + "T00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}{" "}
                            at {bookedSlot.time}
                          </div>
                        ) : (
                          profile.roles?.length > 0 && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-[#5b6472]">
                              <Briefcase className="h-4 w-4 text-[#3fa9e0]" />{profile.roles.slice(0, 2).join(", ")}
                            </div>
                          )
                        )}

                        <div className="mt-5 flex gap-2">
                          <button
                            onClick={() => { setSelected(profile); setActiveTab("Overview"); }}
                            className="flex-1 rounded-full border border-[#dde1ea] py-2.5 text-sm font-semibold text-[#5b6472] hover:border-[#3fa9e0] transition-colors"
                          >
                            View profile
                          </button>
                          <button
                            onClick={() => setBookingFor(profile)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-[#3fa9e0] py-2.5 text-sm font-semibold text-white hover:bg-[#2c8bbd] transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" /> Book a chat
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Book a chat modal */}
      {bookingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8" onClick={() => setBookingFor(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#11203a]">
                Book a chat with {bookingFor.first_name}
              </h2>
              <button onClick={() => setBookingFor(null)} className="text-[#8d95a3] hover:text-[#11203a] text-xl">✕</button>
            </div>

            {(!bookingFor.interview_availability || bookingFor.interview_availability.length === 0) ? (
              <p className="mt-6 rounded-xl bg-[#f7f8fb] p-5 text-sm text-[#5b6472]">
                {bookingFor.first_name} hasn't added any interview availability yet. Try reaching out directly via their contact details, or check back later.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="text-sm text-[#5b6472]">
                  <Clock className="mr-1.5 inline h-4 w-4" />
                  Pick a slot from {bookingFor.first_name}'s submitted availability:
                </p>
                {Object.entries(
                  (bookingFor.interview_availability as { date: string; time: string }[]).reduce(
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
                        {new Date(date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {times.sort().map(time => (
                          <button
                            key={time}
                            onClick={() => bookSlot(bookingFor.id, { date, time })}
                            className="rounded-full border border-[#3fa9e0] px-3 py-1.5 text-sm font-medium text-[#3fa9e0] hover:bg-[#3fa9e0] hover:text-white transition-colors"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full profile modal — Camp Canada style with tabs */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8" onClick={() => setSelected(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white flex flex-col" onClick={e => e.stopPropagation()}>

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
                        onClick={() => setBookingFor(selected)}
                        className="flex items-center gap-1.5 rounded-full border border-[#3fa9e0] px-4 py-2 text-sm font-semibold text-[#3fa9e0] hover:bg-[#3fa9e0]/10"
                      >
                        <MessageSquare className="h-4 w-4" /> Schedule interview
                      </button>
                      <button
                        onClick={() => toggleWatchlist(selected.id)}
                        className="flex items-center gap-1.5 rounded-full border border-[#dde1ea] px-4 py-2 text-sm font-semibold text-[#5b6472] hover:border-[#3fa9e0]"
                      >
                        <Heart className={`h-4 w-4 ${watchlistIds.includes(selected.id) ? "fill-red-500 text-red-500" : ""}`} />
                        {watchlistIds.includes(selected.id) ? "Saved" : "Watchlist"}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-[#8d95a3] hover:text-[#11203a] text-2xl">✕</button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
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

              <div className="flex-1 overflow-y-auto p-6">

                {activeTab === "Overview" && (
                  <div className="space-y-5 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#f7f8fb] p-4">
                        <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Available</p>
                        <p className="mt-1 font-medium text-[#11203a]">
                          {selected.full_season ? "Full season (Dec 1 – mid April)" : `${selected.start_date} → ${selected.end_date}`}
                        </p>
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
                    {selected.full_season ? (
                      <p className="text-[#5b6472]"><span className="font-medium text-[#11203a]">Full season:</span> Approx 1 Dec – mid April</p>
                    ) : (
                      <>
                        <p className="text-[#5b6472]"><span className="font-medium text-[#11203a]">From:</span> {selected.start_date}</p>
                        <p className="text-[#5b6472]"><span className="font-medium text-[#11203a]">Until:</span> {selected.end_date}</p>
                      </>
                    )}
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