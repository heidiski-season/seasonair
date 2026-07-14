"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mountain, CheckCircle, XCircle, LogOut } from "lucide-react";
import Link from "next/link";

const ADMIN_EMAIL = "yourskiseason@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [chalets, setChalets] = useState<any[]>([]);
  const [YourSkiSeasons, setYourSkiSeasons] = useState<any[]>([]);
  const [tab, setTab] = useState<"chalets" | "YourSkiSeasons">("chalets");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }
      setUser(user);

      const { data: chalets } = await supabase
        .from("chalet_companies")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: YourSkiSeasons } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setChalets(chalets || []);
      setYourSkiSeasons(YourSkiSeasons || []);
      setLoading(false);
    };
    getData();
  }, []);

  const approveChalet = async (id: string) => {
    await supabase
      .from("chalet_companies")
      .update({ approved: true })
      .eq("id", id);
    setChalets(c => c.map(ch => ch.id === id ? { ...ch, approved: true } : ch));
  };

  const rejectChalet = async (id: string) => {
    await supabase
      .from("chalet_companies")
      .update({ approved: false })
      .eq("id", id);
    setChalets(c => c.map(ch => ch.id === id ? { ...ch, approved: false } : ch));
  };

  const approveYourSkiSeason = async (id: string) => {
    await supabase
      .from("profiles")
      .update({ approved: true })
      .eq("id", id);
    setYourSkiSeasons(s => s.map(p => p.id === id ? { ...p, approved: true } : p));
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);
    setYourSkiSeasons(s => s.map(p => p.id === id ? { ...p, status } : p));
  };

  const openProfile = (profile: any) => {
    setSelected(profile);
    setNotesDraft(profile.admin_notes || "");
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    await supabase
      .from("profiles")
      .update({ admin_notes: notesDraft })
      .eq("id", selected.id);
    setYourSkiSeasons(s => s.map(p => p.id === selected.id ? { ...p, admin_notes: notesDraft } : p));
    setSelected((sel: any) => ({ ...sel, admin_notes: notesDraft }));
    setSavingNotes(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const age = (dob: string) => {
    if (!dob) return "";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
      <p className="text-[#5b6472]">Loading admin panel...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fb]">

      {/* Top bar */}
      <div className="border-b border-[#dde1ea] bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-[#11203a]">
          <Mountain className="h-5 w-5 text-[#3fa9e0]" strokeWidth={2.5} />
          YourSkiSeason — Admin
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#5b6472] hover:text-[#11203a]">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total YourSkiSeasons", value: YourSkiSeasons.length },
            { label: "Approved YourSkiSeasons", value: YourSkiSeasons.filter(s => s.approved).length },
            { label: "Chalet companies", value: chalets.length },
            { label: "Pending approval", value: chalets.filter(c => !c.approved).length },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl border border-[#dde1ea] bg-white p-5 text-center">
              <p className="font-display text-3xl font-semibold text-[#11203a]">{stat.value}</p>
              <p className="mt-1 text-xs text-[#8d95a3]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("chalets")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === "chalets" ? "bg-[#3fa9e0] text-white" : "border border-[#dde1ea] bg-white text-[#5b6472] hover:border-[#3fa9e0]"}`}
          >
            Chalet companies ({chalets.length})
          </button>
          <button
            onClick={() => setTab("YourSkiSeasons")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === "YourSkiSeasons" ? "bg-[#3fa9e0] text-white" : "border border-[#dde1ea] bg-white text-[#5b6472] hover:border-[#3fa9e0]"}`}
          >
            YourSkiSeasons ({YourSkiSeasons.length})
          </button>
        </div>

        {/* Chalet companies table */}
        {tab === "chalets" && (
          <div className="rounded-2xl border border-[#dde1ea] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-[#dde1ea] bg-[#f7f8fb]">
                <tr>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Company</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Contact</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Resort</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Status</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde1ea]">
                {chalets.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[#8d95a3]">No chalet companies yet.</td></tr>
                )}
                {chalets.map(chalet => (
                  <tr key={chalet.id} className="hover:bg-[#f7f8fb]">
                    <td className="px-6 py-4 font-medium text-[#11203a]">{chalet.company_name}</td>
                    <td className="px-6 py-4 text-[#5b6472]">
                      <p>{chalet.contact_name}</p>
                      <p className="text-xs text-[#8d95a3]">{chalet.email}</p>
                    </td>
                    <td className="px-6 py-4 text-[#5b6472]">{chalet.resort}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wide ${chalet.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {chalet.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!chalet.approved && (
                          <button
                            onClick={() => approveChalet(chalet.id)}
                            className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => rejectChalet(chalet.id)}
                          className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* YourSkiSeasons table */}
        {tab === "YourSkiSeasons" && (
          <div className="rounded-2xl border border-[#dde1ea] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-[#dde1ea] bg-[#f7f8fb]">
                <tr>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Name</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Resort</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Roles</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Status</th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde1ea]">
                {YourSkiSeasons.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[#8d95a3]">No YourSkiSeasons yet.</td></tr>
                )}
                {YourSkiSeasons.map(p => (
                  <tr key={p.id} className="hover:bg-[#f7f8fb]">
                    <td className="px-6 py-4">
                      <button onClick={() => openProfile(p)} className="text-left hover:underline">
                        <p className="font-medium text-[#11203a]">{p.first_name} {p.last_name}</p>
                        <p className="text-xs text-[#8d95a3]">{p.email}</p>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-[#5b6472]">{p.resort || "—"}</td>
                    <td className="px-6 py-4 text-[#5b6472]">{(p.roles || []).slice(0, 2).join(", ") || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={p.status || "pending"}
                        onChange={e => updateStatus(p.id, e.target.value)}
                        className="rounded-lg border border-[#dde1ea] px-2 py-1 text-xs text-[#11203a] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="submitted">Submitted</option>
                        <option value="interview">Interview</option>
                        <option value="matched">Matched</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openProfile(p)}
                          className="rounded-full border border-[#dde1ea] px-3 py-1.5 text-xs font-semibold text-[#5b6472] hover:border-[#3fa9e0]"
                        >
                          View profile
                        </button>
                        {!p.approved ? (
                          <button
                            onClick={() => approveYourSkiSeason(p.id)}
                            className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </button>
                        ) : (
                          <span className="font-mono text-xs text-green-600">✓ Visible</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Full profile modal with notes */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8" onClick={() => setSelected(null)}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8" onClick={e => e.stopPropagation()}>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#3fa9e0] to-[#11203a] font-display text-xl font-semibold text-white">
                  {selected.first_name?.[0]}{selected.last_name?.[0]}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#11203a]">
                    {selected.first_name} {selected.last_name}
                  </h2>
                  <p className="text-sm text-[#5b6472]">
                    {age(selected.dob) && `${age(selected.dob)} · `}{selected.nationality}
                  </p>
                  <p className="text-xs text-[#8d95a3]">{selected.email} · {selected.phone || "no phone"}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#8d95a3] hover:text-[#11203a] text-2xl">✕</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#f7f8fb] p-4">
                <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Season availability</p>
                <p className="mt-1 text-sm font-medium text-[#11203a]">
                  {selected.full_season ? "Full season (Dec 1 – mid April)" : `${selected.start_date || "—"} → ${selected.end_date || "—"}`}
                </p>
        </div>
              <div className="rounded-xl bg-[#f7f8fb] p-4">
                <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3]">Resort preference</p>
                <p className="mt-1 text-sm font-medium text-[#11203a]">{selected.resort || "No preference"}</p>
              </div>
            </div>

            {selected.roles?.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-2">Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selected.roles.map((r: string) => (
                    <span key={r} className="rounded-full bg-[#3fa9e0]/10 px-3 py-1 text-xs font-medium text-[#3fa9e0]">{r}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 space-y-4 text-sm">
              {selected.emergency_name && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">Emergency contact</p>
                  <p className="text-[#5b6472]">{selected.emergency_name} ({selected.emergency_relationship || "—"}) · {selected.emergency_phone}</p>
                </div>
              )}
              {selected.university && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">Education</p>
                  <p className="text-[#5b6472]">{selected.degree} · {selected.university} · {selected.grad_year}</p>
                </div>
              )}
              {selected.skills && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">Skills</p>
                  <p className="text-[#5b6472] leading-relaxed">{selected.skills}</p>
                </div>
              )}
              {selected.why_season && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">Why they want a season</p>
                  <p className="text-[#5b6472] leading-relaxed">{selected.why_season}</p>
                </div>
              )}
              {selected.motivation && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">More about them</p>
                  <p className="text-[#5b6472] leading-relaxed">{selected.motivation}</p>
                </div>
              )}
              {selected.video_url && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">Video introduction</p>
                  <a href={selected.video_url} target="_blank" className="text-[#3fa9e0] underline">Watch video →</a>
                </div>
              )}
              {selected.interview_availability?.length > 0 && (
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8d95a3] mb-1">Interview availability</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.interview_availability.map((slot: any, i: number) => (
                      <span key={i} className="rounded-full bg-[#f7f8fb] px-3 py-1 text-xs text-[#5b6472]">
                        {slot.date} at {slot.time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin notes */}
            <div className="mt-6 border-t border-[#dde1ea] pt-6">
              <label className="mb-1.5 block text-sm font-medium text-[#11203a]">Admin notes (private — only you see this)</label>
              <textarea
                rows={4}
                value={notesDraft}
                onChange={e => setNotesDraft(e.target.value)}
                placeholder="Add any notes about this candidate..."
                className="w-full rounded-xl border border-[#dde1ea] px-4 py-3 text-sm text-[#11203a] placeholder:text-[#8d95a3] focus:border-[#3fa9e0] focus:outline-none focus:ring-2 focus:ring-[#3fa9e0]/20"
              />
              <button
                onClick={saveNotes}
                className="mt-3 rounded-full bg-[#3fa9e0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2c8bbd] transition-colors"
              >
                {savingNotes ? "Saving..." : "Save notes"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}