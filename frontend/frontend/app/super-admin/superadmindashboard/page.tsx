"use client";

import { useState } from "react";

// Design tokens match the rest of EduSense:
// #1B1035 base · #2A1B54 surface · #2DD4BF teal · #FBBF24 amber
// · #F5F3FF text · #A78BCA muted

type Tab = "overview" | "organizations" | "content" | "roles";

const KPIS = [
  { label: "Organizations", value: "18" },
  { label: "Total students", value: "4,320" },
  { label: "Avg. attention score", value: "71%" },
  { label: "Flagged sessions (7d)", value: "26" },
];

const ORGS = [
  { name: "Delta Polytechnic", plan: "Institution", students: 1240, status: "active" },
  { name: "Riverbend High", plan: "School", students: 860, status: "active" },
  { name: "Northgate College", plan: "Institution", students: 2020, status: "suspended" },
];

const PERMISSIONS = [
  "course.create", "content.upload", "user.invite", "risk.view",
  "quiz.manage", "org.manage", "role.manage",
];

export default function SuperadminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [uploadType, setUploadType] = useState<"SCORM" | "VIDEO" | "PPT_SLIDES">("SCORM");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadMsg("");
    const form = new FormData(e.currentTarget);

    try {
      const endpoint = uploadType === "SCORM" ? "/api/content/upload-scorm" : "/api/content/upload-native";
      const res = await fetch(endpoint, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      setUploadMsg(`Uploaded successfully — content ID ${data.id}`);
      e.currentTarget.reset();
    } catch (err: any) {
      setUploadMsg(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1035] text-[#F5F3FF]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Top bar */}
      <div className="border-b border-[#2A1B54] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-semibold text-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
          EduSense
          <span className="font-mono text-xs text-[#FBBF24] ml-2 border border-[#3D2B6B] rounded-full px-2 py-0.5">
            SUPER ADMIN
          </span>
        </div>
        <div className="font-body text-sm text-[#A78BCA]">superadmin@edusense.com</div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-56 border-r border-[#2A1B54] p-6 space-y-1">
          {([
            ["overview", "Overview"],
            ["organizations", "Organizations"],
            ["content", "Content Library"],
            ["roles", "Roles & Permissions"],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-body text-sm transition-colors ${
                tab === key
                  ? "bg-[#2DD4BF]/15 text-[#2DD4BF]"
                  : "text-[#A78BCA] hover:bg-[#2A1B54]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          {tab === "overview" && (
            <div>
              <h1 className="font-display font-semibold text-2xl mb-6">Platform overview</h1>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {KPIS.map((k) => (
                  <div key={k.label} className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-5">
                    <div className="font-mono text-2xl font-semibold text-[#2DD4BF]">{k.value}</div>
                    <div className="font-body text-xs text-[#A78BCA] mt-1">{k.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-6">
                <h2 className="font-display font-semibold text-lg mb-4">Recent audit events</h2>
                <div className="space-y-3 font-body text-sm">
                  {[
                    "Admin created for Delta Polytechnic",
                    "SCORM package uploaded — 'Intro to Java Threads'",
                    "Role 'Head TA' created for Riverbend High",
                  ].map((line, i) => (
                    <div key={i} className="flex justify-between text-[#C9BEEA] border-b border-[#3D2B6B] pb-3 last:border-0">
                      <span>{line}</span>
                      <span className="font-mono text-xs text-[#A78BCA]">2h ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "organizations" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-display font-semibold text-2xl">Organizations</h1>
                <button className="px-4 py-2 rounded-full bg-[#2DD4BF] text-[#1B1035] font-body font-semibold text-sm hover:bg-[#5EEAD4] transition-colors">
                  + New organization
                </button>
              </div>
              <div className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl overflow-hidden">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="text-left text-[#A78BCA] text-xs border-b border-[#3D2B6B]">
                      <th className="px-6 py-3 font-normal">Name</th>
                      <th className="px-6 py-3 font-normal">Plan</th>
                      <th className="px-6 py-3 font-normal">Students</th>
                      <th className="px-6 py-3 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORGS.map((o) => (
                      <tr key={o.name} className="border-b border-[#3D2B6B] last:border-0">
                        <td className="px-6 py-4 font-display font-medium">{o.name}</td>
                        <td className="px-6 py-4 text-[#A78BCA]">{o.plan}</td>
                        <td className="px-6 py-4 font-mono">{o.students.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`font-mono text-xs px-2 py-1 rounded-full ${
                              o.status === "active"
                                ? "bg-[#2DD4BF]/15 text-[#2DD4BF]"
                                : "bg-[#FBBF24]/15 text-[#FBBF24]"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="max-w-xl">
              <h1 className="font-display font-semibold text-2xl mb-2">Upload content</h1>
              <p className="font-body text-sm text-[#A78BCA] mb-6">
                SCORM packages are tracked via the SCORM runtime API. Videos and slides use native progress tracking.
              </p>

              <div className="flex gap-2 mb-6">
                {(["SCORM", "VIDEO", "PPT_SLIDES"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setUploadType(t)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-colors ${
                      uploadType === t
                        ? "bg-[#2DD4BF] text-[#1B1035]"
                        : "border border-[#3D2B6B] text-[#A78BCA]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleUpload} className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block font-body text-xs text-[#A78BCA] mb-1.5">Course ID</label>
                  <input
                    name="course_id"
                    required
                    className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm focus:outline-none focus:border-[#2DD4BF]"
                    placeholder="course-uuid"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs text-[#A78BCA] mb-1.5">Title</label>
                  <input
                    name="title"
                    required
                    className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm focus:outline-none focus:border-[#2DD4BF]"
                    placeholder="Intro to Java Threads"
                  />
                </div>
                {uploadType !== "SCORM" && (
                  <input type="hidden" name="content_type" value={uploadType} />
                )}
                <div>
                  <label className="block font-body text-xs text-[#A78BCA] mb-1.5">
                    {uploadType === "SCORM" ? "SCORM package (.zip)" : "File"}
                  </label>
                  <input
                    name="file"
                    type="file"
                    required
                    accept={uploadType === "SCORM" ? ".zip" : uploadType === "VIDEO" ? "video/*" : ".ppt,.pptx,.pdf,.gif"}
                    className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm text-[#A78BCA]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#1B1035] font-body font-semibold hover:bg-[#5EEAD4] transition-colors disabled:opacity-60"
                >
                  {uploading ? "Uploading…" : "Upload"}
                </button>
                {uploadMsg && (
                  <p className="font-body text-sm text-[#FBBF24]">{uploadMsg}</p>
                )}
              </form>
            </div>
          )}

          {tab === "roles" && (
            <div className="max-w-2xl">
              <h1 className="font-display font-semibold text-2xl mb-2">Roles & permissions</h1>
              <p className="font-body text-sm text-[#A78BCA] mb-6">
                Organizations build custom roles from this permission catalogue.
              </p>
              <div className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-6">
                <h2 className="font-display font-semibold text-sm mb-4 text-[#A78BCA]">PERMISSION CATALOGUE</h2>
                <div className="flex flex-wrap gap-2">
                  {PERMISSIONS.map((p) => (
                    <span
                      key={p}
                      className="font-mono text-xs px-3 py-1.5 rounded-full border border-[#3D2B6B] text-[#2DD4BF]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}