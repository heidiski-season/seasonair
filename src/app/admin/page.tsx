"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mountain, CheckCircle, XCircle, LogOut } from "lucide-react";
import Link from "next/link";

const ADMIN_EMAIL = "heidirwarren@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [chalets, setChalets] = useState<any[]>([]);
  const [YourSkiSeaones, setYourSkiSeaones] = useState<any[]>([]);
  const [tab, setTab] = useState<"chalets" | "YourSkiSeaones">("chalets");
  const [loading, setLoading] = useState(true);
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

      const { data: YourSkiSeaones } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setChalets(chalets || []);
      setYourSkiSeaones(YourSkiSeaones || []);
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

  const approveYourSkiSeaone = async (id: string) => {
    await supabase
      .from("profiles")
      .update({ approved: true })
      .eq("id", id);
    setYourSkiSeaones(s => s.map(p => p.id === id ? { ...p, approved: true } : p));
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);
    setYourSkiSeaones(s => s.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
          YourSkiSeaon — Admin
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
            { label: "Total YourSkiSeaones", value: YourSkiSeaones.length },
            { label: "Approved YourSkiSeaones", value: YourSkiSeaones.filter(s => s.approved).length },
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
            onClick={() => setTab("YourSkiSeaones")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === "YourSkiSeaones" ? "bg-[#3fa9e0] text-white" : "border border-[#dde1ea] bg-white text-[#5b6472] hover:border-[#3fa9e0]"}`}
          >
            YourSkiSeaones ({YourSkiSeaones.length})
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

        {/* YourSkiSeaones table */}
        {tab === "YourSkiSeaones" && (
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
                {YourSkiSeaones.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[#8d95a3]">No YourSkiSeaones yet.</td></tr>
                )}
                {YourSkiSeaones.map(p => (
                  <tr key={p.id} className="hover:bg-[#f7f8fb]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#11203a]">{p.first_name} {p.last_name}</p>
                      <p className="text-xs text-[#8d95a3]">{p.email}</p>
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
                        <option value="interview">Interview</option>
                        <option value="matched">Matched</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {!p.approved ? (
                        <button
                          onClick={() => approveYourSkiSeaone(p.id)}
                          className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-green-600">✓ Visible to chalets</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}