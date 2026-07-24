"use client";

import Sidebar from "@/app/components/dashboard/Sidebar";
import Header from "@/app/components/dashboard/Header";

const COURSES = [
  { title: "Intro to Java Threads", progress: 72, nextUp: "Lesson 6: Synchronization" },
  { title: "Data Structures Basics", progress: 45, nextUp: "Lesson 4: Linked Lists" },
  { title: "Discrete Mathematics", progress: 90, nextUp: "Final review" },
];

const KPIS = [
  { label: "Attention score (avg)", value: "78%", accent: "teal" },
  { label: "Courses in progress", value: "3", accent: "amber" },
  { label: "Quizzes completed", value: "12", accent: "teal" },
  { label: "Risk level", value: "Low", accent: "teal" },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#1B1035] text-[#F5F3FF] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <Sidebar />

      <div className="flex-1 min-w-0">
        <Header title="Overview" />

        <main className="px-8 py-8 space-y-8">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KPIS.map((k) => (
              <div key={k.label} className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-5">
                <div
                  className={`font-mono text-2xl font-semibold ${
                    k.accent === "teal" ? "text-[#2DD4BF]" : "text-[#FBBF24]"
                  }`}
                >
                  {k.value}
                </div>
                <div className="font-body text-xs text-[#A78BCA] mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Continue learning */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">Continue learning</h2>
              <a href="/student/courses" className="font-mono text-xs text-[#2DD4BF] hover:underline">
                View all →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {COURSES.map((c) => (
                <div
                  key={c.title}
                  className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-5 hover:border-[#2DD4BF]/50 transition-colors"
                >
                  <h3 className="font-display font-semibold text-base mb-1">{c.title}</h3>
                  <p className="font-body text-xs text-[#A78BCA] mb-4">{c.nextUp}</p>
                  <div className="w-full h-1.5 bg-[#1B1035] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B21B6] to-[#2DD4BF]"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-[#A78BCA]">{c.progress}% complete</span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column: risk explanation + chatbot prompt */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-6">
              <span className="font-mono text-xs text-[#2DD4BF]">RISK EXPLANATION</span>
              <h3 className="font-display font-semibold text-lg mt-2 mb-3">You're on track</h3>
              <p className="font-body text-sm text-[#A78BCA] leading-relaxed">
                Your attendance and quiz scores are both above class average, and your attention
                score has stayed steady over the last 5 sessions. Keep it up.
              </p>
            </div>
            <div className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-6">
              <span className="font-mono text-xs text-[#FBBF24]">HAVE A DOUBT?</span>
              <h3 className="font-display font-semibold text-lg mt-2 mb-3">Ask Luna</h3>
              <p className="font-body text-sm text-[#A78BCA] leading-relaxed mb-4">
                Get instant answers grounded strictly in your course notes and slides.
              </p>
              <a
                href="/student/chatbot"
                className="inline-block px-4 py-2 rounded-full bg-[#2DD4BF] text-[#1B1035] font-body text-sm font-semibold hover:bg-[#5EEAD4] transition-colors"
              >
                Open chatbot
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}