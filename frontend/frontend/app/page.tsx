"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimationController } from "./components/avatar/AnimationController";
import { TourController } from "./components/avatar/TourController";
import { SpeechController, TOUR_STEPS } from "./components/avatar/SpeechController";

const AvatarCanvas = dynamic(() => import("./components/avatar/AvatarCanvas"), {
  ssr: false,
});

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
  const animControllerRef = useRef<AnimationController | null>(null);
  const tourControllerRef = useRef<TourController | null>(null);

  const [tourStep, setTourStep] = useState<number | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);

  useEffect(() => {
    const animCtrl = new AnimationController();
    const tourCtrl = new TourController(animCtrl);

    animControllerRef.current = animCtrl;
    tourControllerRef.current = tourCtrl;

    const unsubTour = tourCtrl.subscribe((step, script) => {
      setTourStep(step);
      if (script) setCurrentDialogue(script.text);
    });

    const speechCtrl = SpeechController.getInstance();
    const unsubSpeech = speechCtrl.subscribe((speaking) => setIsSpeaking(speaking));

    return () => {
      unsubTour();
      unsubSpeech();
    };
  }, []);

  const handleNextTourStep = () => tourControllerRef.current?.nextStep();
  const handleSkipTour = () => tourControllerRef.current?.skipTour();

  return (
    <div className="min-h-screen bg-[#1B1035] text-[#F5F3FF] overflow-x-hidden relative font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* ── Nav — floats over the full-bleed hero canvas ── */}
      <nav className="absolute top-0 left-0 right-0 z-30 max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
          EduSense
        </div>
        <div className="hidden md:flex items-center gap-8 font-body text-sm text-[#A78BCA]">
          <a href="#pipeline" className="hover:text-[#F5F3FF] transition-colors">How it works</a>
          <a href="#features" className="hover:text-[#F5F3FF] transition-colors">Features</a>
        </div>
        <div className="flex items-center gap-3 font-body text-sm">
          <a href="/auth/login" className="px-4 py-2 text-[#F5F3FF] hover:text-[#2DD4BF] transition-colors">Log in</a>
          <a href="/auth/register" className="px-4 py-2 rounded-full bg-[#2DD4BF] text-[#1B1035] font-semibold hover:bg-[#5EEAD4] transition-colors shadow-lg">Get started</a>
        </div>
      </nav>

      {/* ── Hero: avatar only, full-bleed ──
          No headline, no copy, no CTA, no score card — per your ask.
          The 3D canvas IS the hero. */}
      <section className="relative w-full h-screen">
        <AvatarCanvas animController={animControllerRef.current!} modelUrl="/avatar/AvatarSample_A.vrm" />

        {tourStep !== null && currentDialogue && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-6">
            <div className="relative bg-[#2A1B54]/95 backdrop-blur-md border border-[#3D2B6B] text-[#F5F3FF] p-5 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5B21B6] to-[#2DD4BF] flex items-center justify-center text-xs font-display font-semibold shrink-0">
                  L
                </div>
                <div className="leading-tight">
                  <div className="font-display font-semibold text-sm flex items-center gap-2">
                    Luna
                    {isSpeaking && (
                      <span className="inline-flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
                        <span className="text-[10px] text-[#2DD4BF] font-mono">SPEAKING</span>
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-[#A78BCA]">EduSense AI 3D Tutor</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4 font-medium">{currentDialogue}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A78BCA] font-mono">Step {tourStep} of 5</span>
                <div className="flex gap-2">
                  <button onClick={handleSkipTour} className="px-3 py-1 text-xs text-[#A78BCA] hover:text-[#F5F3FF] transition-colors">
                    Skip
                  </button>
                  <button
                    onClick={handleNextTourStep}
                    className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#2DD4BF] text-[#1B1035] hover:bg-[#5EEAD4] transition-all shadow-md"
                  >
                    {tourStep === 5 ? "Finish!" : "Next Step →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Pipeline Section ── */}
      <section
        id="pipeline"
        className={`max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] transition-all duration-300 ${
          tourStep === 2 ? "ring-4 ring-[#2DD4BF] bg-[#2A1B54]/20 rounded-3xl z-20" : ""
        }`}
      >
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

      {/* ── Features Section ── */}
      <section
        id="features"
        className={`max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] transition-all duration-300 ${
          tourStep === 3 ? "ring-4 ring-[#2DD4BF] bg-[#2A1B54]/20 rounded-3xl z-20" : ""
        }`}
      >
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs text-[#2DD4BF]">UNDER THE HOOD</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3 tracking-tight">
            Four models, one continuous read on the student.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl p-7 hover:border-[#2DD4BF]/50 transition-colors shadow-sm">
              <div className={`w-9 h-9 rounded-lg mb-5 ${f.accent === "teal" ? "bg-[#2DD4BF]/15" : "bg-[#FBBF24]/15"}`} />
              <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
              <p className="font-body text-sm text-[#A78BCA] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA / Registration Section ── */}
      <section
        className={`max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] text-center transition-all duration-300 ${
          tourStep === 5 ? "ring-4 ring-[#FBBF24] bg-[#2A1B54]/30 rounded-3xl z-20" : ""
        }`}
      >
        <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tight mb-6 max-w-2xl mx-auto">
          Give every student a tutor that actually notices them.
        </h2>
        <a href="/auth/register" className="inline-block px-7 py-3.5 rounded-full bg-[#2DD4BF] text-[#1B1035] font-body font-semibold hover:bg-[#5EEAD4] transition-colors shadow-xl">
          Create your free account
        </a>
      </section>

      {/* ── RAG Chatbot Widget Mockup ── */}
      <div
        className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${
          tourStep === 4 ? "ring-4 ring-[#2DD4BF] scale-105" : ""
        }`}
      >
        {chatBotOpen ? (
          <div className="w-80 bg-[#2A1B54] border border-[#3D2B6B] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-body">
            <div className="bg-[#1B1035] p-4 border-b border-[#3D2B6B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                <span className="text-xs font-mono font-semibold text-[#F5F3FF]">Luna · Knowledge Bot</span>
              </div>
              <button onClick={() => setChatBotOpen(false)} className="text-[#A78BCA] hover:text-[#F5F3FF] text-xs font-mono">✕</button>
            </div>
            <div className="h-48 p-4 overflow-y-auto space-y-3 text-xs font-body">
              <div className="bg-[#1B1035] p-3 rounded-xl max-w-[85%] text-[#A78BCA]">
                Upload class notes or PDFs. I answer questions based strictly on your source materials!
              </div>
              <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 p-3 rounded-xl max-w-[85%] ml-auto text-right text-[#F5F3FF]">
                What is linear regression?
              </div>
              <div className="bg-[#1B1035] p-3 rounded-xl max-w-[85%] text-[#2DD4BF] font-medium">
                According to Chapter 2 (Page 14): It calculates the linear relationship between variables using line equations...
              </div>
            </div>
            <div className="p-3 border-t border-[#3D2B6B] bg-[#1B1035] flex gap-2">
              <input
                type="text"
                placeholder="Ask about your course materials..."
                disabled
                className="bg-[#2A1B54] border border-[#3D2B6B] rounded-lg px-3 py-1.5 text-xs text-[#A78BCA] w-full focus:outline-none"
              />
              <button className="bg-[#3D2B6B] text-[#F5F3FF] px-3 rounded-lg text-xs font-semibold">Send</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setChatBotOpen(true)} className="w-12 h-12 rounded-full bg-[#2DD4BF] text-[#1B1035] flex items-center justify-center font-bold text-lg shadow-2xl hover:bg-[#5EEAD4] transition-all transform hover:scale-110">
            💬
          </button>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[#2A1B54]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" /> EduSense
          </div>
          <p className="font-mono text-xs text-[#A78BCA]">© 2026 EduSense. Built to notice.</p>
        </div>
      </footer>
    </div>
  );
}