"use client";

import { useEffect, useState } from "react";

// ── EduSense Landing Page ────────────────────────────────────────────────
// Design tokens
// Color   : #1B1035 (base) · #2A1B54 (surface) · #2DD4BF (focus teal)
//           #FBBF24 (attention amber) · #F5F3FF (text) · #A78BCA (muted)
// Type    : Space Grotesk (display) · Inter (body) · JetBrains Mono (data)
// Signature: live "attention pulse" ring — the product's own monitoring
//            loop, rendered as the hero's centerpiece.
// ──────────────────────────────────────────────────────────────────────────

const PIPELINE = [
  { step: "01", label: "Watch", detail: "Student streams the lesson video." },
  { step: "02", label: "Monitor", detail: "OpenCV reads attention, blink rate, head pose in real time." },
  { step: "03", label: "Ask", detail: "RAG chatbot answers doubts strictly from the teacher's own notes." },
  { step: "04", label: "Adapt", detail: "An RL agent adjusts quiz difficulty question by question." },
  { step: "05", label: "Flag", detail: "Random Forest + Decision Tree predict risk and explain why." },
  { step: "06", label: "Report", detail: "Teachers see who needs help, and exactly what's driving it." },
];

const FEATURES = [
  {
    title: "Attention Tracking",
    body: "Face presence, gaze, blink rate and drowsiness, scored continuously — not a single end-of-class checkbox.",
    accent: "teal",
  },
  {
    title: "Notes-Only Chatbot",
    body: "Answers are retrieved from the material the teacher uploaded. No hallucinated shortcuts, no outside content.",
    accent: "amber",
  },
  {
    title: "Explainable Risk",
    body: "A Random Forest predicts who's falling behind; a Decision Tree shows the exact reasoning, in plain terms.",
    accent: "teal",
  },
  {
    title: "Quizzes That Adjust",
    body: "A reinforcement-learning agent keeps every student in their own challenge zone, question by question.",
    accent: "amber",
  },
];

export default function LandingPage() {
  const [score, setScore] = useState(62);

  useEffect(() => {
    const id = setInterval(() => {
      setScore((s) => {
        const next = s + (Math.random() * 10 - 4);
        return Math.max(58, Math.min(96, Math.round(next)));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#1B1035] text-[#F5F3FF] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.35); }
          70%  { box-shadow: 0 0 0 22px rgba(45, 212, 191, 0); }
          100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); }
        }
        .ring-pulse { animation: pulse-ring 2.6s cubic-bezier(0.4,0,0.6,1) infinite; }

        @keyframes drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .drift { animation: drift 6s ease-in-out infinite; }

        @keyframes sweep {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(220%); opacity: 0; }
        }
        .scan-line { animation: sweep 3.2s ease-in-out infinite; }
      `}</style>

      {/* ── Nav ── */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
          EduSense
        </div>
        <div className="hidden md:flex items-center gap-8 font-body text-sm text-[#A78BCA]">
          <a href="#pipeline" className="hover:text-[#F5F3FF] transition-colors">How it works</a>
          <a href="#features" className="hover:text-[#F5F3FF] transition-colors">Features</a>
        </div>
        <div className="flex items-center gap-3 font-body text-sm">
          <a href="/login" className="px-4 py-2 text-[#F5F3FF] hover:text-[#2DD4BF] transition-colors">
            Log in
          </a>
          <a
            href="/register"
            className="px-4 py-2 rounded-full bg-[#2DD4BF] text-[#1B1035] font-semibold hover:bg-[#5EEAD4] transition-colors"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#A78BCA] border border-[#3D2B6B] rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            NOW MONITORING · LIVE SESSION
          </div>
          <h1 className="font-display font-semibold text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            An AI tutor that notices
            <span className="text-[#2DD4BF]"> when you stop paying attention.</span>
          </h1>
          <p className="font-body text-lg text-[#C9BEEA] max-w-lg mb-9 leading-relaxed">
            EduSense watches attention through the webcam, answers doubts only from your teacher's own notes,
            and quietly flags who's at risk — before the exam does.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/register"
              className="px-6 py-3 rounded-full bg-[#FBBF24] text-[#1B1035] font-body font-semibold hover:bg-[#FCD34D] transition-colors"
            >
              Start learning
            </a>
            <a
              href="#pipeline"
              className="px-6 py-3 rounded-full border border-[#3D2B6B] text-[#F5F3FF] font-body hover:border-[#2DD4BF] transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Signature element: live attention pulse */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full bg-[#2DD4BF]/10 blur-3xl drift" />
          <div className="relative w-80 bg-[#2A1B54] border border-[#3D2B6B] rounded-3xl p-7 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent scan-line" />
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-[#A78BCA]">SESSION_04A2</span>
              <span className="font-mono text-xs text-[#FBBF24]">● REC</span>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 rounded-full border-2 border-[#2DD4BF] ring-pulse flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#F5F3FF]">
                  <circle cx="50" cy="38" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M20 88 Q50 58 80 88" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-5">
              <div className="font-mono text-4xl font-semibold text-[#2DD4BF] tabular-nums">
                {score}%
              </div>
              <div className="font-body text-xs text-[#A78BCA] mt-1">Attention score</div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[#C9BEEA]">
                <span>Head pose</span><span className="text-[#2DD4BF]">forward</span>
              </div>
              <div className="flex justify-between text-[#C9BEEA]">
                <span>Blink rate</span><span className="text-[#2DD4BF]">normal</span>
              </div>
              <div className="flex justify-between text-[#C9BEEA]">
                <span>Faces detected</span><span className="text-[#2DD4BF]">1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pipeline ── */}
      <section id="pipeline" className="max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54]">
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs text-[#FBBF24]">THE LOOP</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3 tracking-tight">
            Every session runs the same six-step cycle.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
          {PIPELINE.map((p) => (
            <div key={p.step} className="border-l-2 border-[#3D2B6B] pl-5">
              <span className="font-mono text-sm text-[#2DD4BF]">{p.step}</span>
              <h3 className="font-display font-semibold text-xl mt-1 mb-2">{p.label}</h3>
              <p className="font-body text-sm text-[#A78BCA] leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54]">
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs text-[#2DD4BF]">UNDER THE HOOD</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3 tracking-tight">
            Four models, one continuous read on the student.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-7 hover:border-[#2DD4BF]/50 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-lg mb-5 ${
                  f.accent === "teal" ? "bg-[#2DD4BF]/15" : "bg-[#FBBF24]/15"
                }`}
              />
              <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
              <p className="font-body text-sm text-[#A78BCA] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] text-center">
        <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tight mb-6 max-w-2xl mx-auto">
          Give every student a tutor that actually notices them.
        </h2>
        <a
          href="/register"
          className="inline-block px-7 py-3.5 rounded-full bg-[#2DD4BF] text-[#1B1035] font-body font-semibold hover:bg-[#5EEAD4] transition-colors"
        >
          Create your free account
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#2A1B54]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
            EduSense
          </div>
          <p className="font-mono text-xs text-[#A78BCA]">© 2026 EduSense. Built to notice.</p>
        </div>
      </footer>
    </div>
  );
}