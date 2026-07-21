"use client";

import { useEffect, useState, useRef } from "react";

// ── EduSense Landing Page with "Luna" — Voice-Enabled AI Anime Tour Guide ──
// Design tokens
// Color   : #1B1035 (base) · #2A1B54 (surface) · #2DD4BF (focus teal)
//           #FBBF24 (attention amber) · #F5F3FF (text) · #A78BCA (muted)
//           #5B21B6 (Luna's blazer — brand purple)
// Type    : Space Grotesk (display) · Inter (body) · JetBrains Mono (data)
// ──────────────────────────────────────────────────────────────────────────

const TUTOR_NAME = "Luna";

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

  // Tour Guide & Voice Animation State Management
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [blinking, setBlinking] = useState(false);

  // Refs for page auto-scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Random attention score simulator loop
  useEffect(() => {
    const id = setInterval(() => {
      setScore((s) => {
        const next = s + (Math.random() * 10 - 4);
        return Math.max(58, Math.min(96, Math.round(next)));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Natural, irregular blink loop — independent of the tour/speech state
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 2600 + Math.random() * 3200;
      timeoutId = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // Tour dialogue script content mapping
  const tourScript = [
    {
      step: 1,
      text: `Hi there! I'm Luna — your EduSense AI Tutor. Give me one minute and I'll show you exactly how this platform helps you learn smarter!`,
    },
    {
      step: 2,
      text: "EduSense isn't just a static website. It uses OpenCV via your webcam to read your engagement, detect if you're getting drowsy, and keep exams honest. It literally adapts to how you learn!",
    },
    {
      step: 3,
      text: "Look right here! We have Advanced Proctoring to catch distractions, a Predictive ML Model that warns you if you're at risk of falling behind, and a Reinforcement Learning Agent that changes quiz difficulty in real time to keep you in the perfect zone!",
    },
    {
      step: 4,
      text: "Oh, my favorite part! See this chat window? That's our AI Knowledge Bot. Upload your own course PDFs or lecture notes, and ask it anything — you'll get instant answers grounded only in your study material.",
    },
    {
      step: 5,
      text: "Before you explore everything on your own, just create an account! Click Register to unlock your personalized dashboard. Ready to supercharge your learning? Let's go!",
    },
  ];

  // Core Speech Synthesis Function
  const speakDialogue = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any ongoing speech immediately
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Choose a friendly female sounding voice profile if available natively
    const voices = window.speechSynthesis.getVoices();
    const cleanVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Zira") || v.lang.startsWith("en"));
    if (cleanVoice) utterance.voice = cleanVoice;

    utterance.rate = 1.05; // Friendly, professional speed
    utterance.pitch = 1.2;  // Higher pitch for anime teacher style

    // Bind layout animation states to audio playback lifecycle hooks
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Auto-start tour guide sequence after a brief landing transition buffer
  useEffect(() => {
    const timer = setTimeout(() => {
      setTourStep(1);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Direct script triggering when structural step mutations occur
  useEffect(() => {
    if (tourStep !== null) {
      const match = tourScript.find(s => s.step === tourStep);
      if (match) {
        speakDialogue(match.text);
      }
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [tourStep]);

  const handleNextTourStep = () => {
    if (tourStep === null) return;

    const nextStep = tourStep + 1;
    if (nextStep > 5) {
      setTourStep(null);
      return;
    }

    setTourStep(nextStep);

    // Contextual scroll adjustments based on targeting tags
    if (nextStep === 2) {
      pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (nextStep === 3) {
      featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (nextStep === 4) {
      setChatBotOpen(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else if (nextStep === 5) {
      ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const currentDialogue = tourScript.find((s) => s.step === tourStep)?.text;

  // Particle field around Luna — small holographic motes with staggered timing
  const PARTICLES = [
    { top: "6%", left: "-6%", size: 6, delay: "0s", duration: "4.5s", color: "#2DD4BF" },
    { top: "18%", left: "104%", size: 5, delay: "0.8s", duration: "5.2s", color: "#FBBF24" },
    { top: "48%", left: "-10%", size: 4, delay: "1.6s", duration: "4s", color: "#2DD4BF" },
    { top: "72%", left: "108%", size: 6, delay: "0.4s", duration: "5.6s", color: "#A78BCA" },
    { top: "88%", left: "-4%", size: 5, delay: "2.1s", duration: "4.8s", color: "#2DD4BF" },
    { top: "2%", left: "58%", size: 4, delay: "1.2s", duration: "5s", color: "#FBBF24" },
  ];

  return (
    <div className="min-h-screen bg-[#1B1035] text-[#F5F3FF] overflow-x-hidden relative font-body">
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

        @keyframes lipSync {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.3); }
        }
        .talking-mouth { animation: lipSync 0.2s infinite alternate ease-in-out; transform-origin: 100px 92px; }

        @keyframes waveHand {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(16deg); }
        }
        .wave-arm { animation: waveHand 0.55s ease-in-out infinite; transform-origin: 52px 148px; }

        @keyframes badgeGlow {
          0%, 100% { opacity: 0.55; r: 5; }
          50% { opacity: 1; r: 6.5; }
        }
        .badge-glow { animation: badgeGlow 1.8s ease-in-out infinite; transform-origin: center; }

        @keyframes particleFloat {
          0%   { transform: translateY(0) translateX(0) scale(0.7); opacity: 0; }
          20%  { opacity: 0.9; }
          50%  { transform: translateY(-14px) translateX(4px) scale(1); opacity: 1; }
          80%  { opacity: 0.7; }
          100% { transform: translateY(0) translateX(0) scale(0.7); opacity: 0; }
        }
        .luna-particle { animation-name: particleFloat; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
      `}</style>

      {/* ── INTERACTIVE TOUR GUIDE OVERLAY COMPONENT ── */}
      {tourStep !== null && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end max-w-sm md:max-w-md transition-all duration-500 ease-out transform translate-y-0 opacity-100 font-body">
          {/* Speech Bubble */}
          <div className="relative bg-[#2A1B54] border border-[#3D2B6B] text-[#F5F3FF] p-5 rounded-2xl shadow-2xl mb-4 mr-2">
            <div className="absolute right-12 -bottom-2 w-4 h-4 bg-[#2A1B54] border-r border-b border-[#3D2B6B] transform rotate-45"></div>

            {/* Character identity header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5B21B6] to-[#2DD4BF] flex items-center justify-center text-xs font-display font-semibold text-[#F5F3FF] shrink-0">
                L
              </div>
              <div className="leading-tight">
                <div className="font-display font-semibold text-sm">{TUTOR_NAME}</div>
                <div className="font-mono text-[10px] text-[#A78BCA]">EduSense AI Tutor</div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4 font-medium">{currentDialogue}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A78BCA] font-mono">Step {tourStep} of 5</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTourStep(null)}
                  className="px-3 py-1 text-xs text-[#A78BCA] hover:text-[#F5F3FF] transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={handleNextTourStep}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#2DD4BF] text-[#1B1035] hover:bg-[#5EEAD4] transition-all flex items-center gap-1 shadow-md"
                >
                  {tourStep === 5 ? "Finish!" : "Next Step →"}
                </button>
              </div>
            </div>
          </div>

          {/* Luna illustration + floating holographic particles */}
          <div className="w-48 h-56 relative overflow-visible drop-shadow-[0_10px_25px_rgba(45,212,191,0.25)] select-none">
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className="luna-particle absolute rounded-full pointer-events-none"
                style={{
                  top: p.top,
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}

            <svg viewBox="0 0 200 240" className="w-full h-full pointer-events-none">
              <g id="luna-illustration">
                {/* Hair Back */}
                <path d="M70,80 Q50,40 100,30 Q150,40 130,80" fill="#241650" />

                {/* Neck & Skin */}
                <path d="M90,110 L110,110 L105,130 L95,130 Z" fill="#FCE7F3" />

                {/* Face Structure */}
                <path d="M75,70 Q100,125 125,70 Q130,50 100,50 Q70,50 75,70 Z" fill="#FFF1F2" />

                {/* Small holographic earpiece */}
                <circle cx="127" cy="78" r="3.2" fill="none" stroke="#2DD4BF" strokeWidth="1.6" />
                <circle cx="127" cy="78" r="1.1" fill="#2DD4BF" className="badge-glow" />

                {/* EXPRESSION STATE: happy (step 5) > blinking > standard focused look */}
                {tourStep === 5 ? (
                  <>
                    <path d="M82,73 Q90,66 98,73" stroke="#1B1035" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    <path d="M102,73 Q110,66 118,73" stroke="#1B1035" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </>
                ) : blinking ? (
                  <>
                    <path d="M83,75 L97,75" stroke="#1B1035" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M103,75 L117,75" stroke="#1B1035" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <ellipse cx="90" cy="75" rx="5" ry="7" fill="#3B2A18" />
                    <ellipse cx="90" cy="73" rx="2" ry="3" fill="#FFFFFF" />
                    <ellipse cx="110" cy="75" rx="5" ry="7" fill="#3B2A18" />
                    <ellipse cx="110" cy="73" rx="2" ry="3" fill="#FFFFFF" />
                  </>
                )}

                {/* Talking mouth vs. warm smile */}
                {isSpeaking ? (
                  <ellipse cx="100" cy="92" rx="4" ry="6" fill="#881337" className="talking-mouth" />
                ) : (
                  <path d="M93,90 Q100,97 107,90" stroke="#1B1035" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                )}

                {/* Hair Front Styling with subtle teal-lit highlight streak */}
                <path d="M70,60 Q100,45 105,65 Q110,45 130,60 Q125,30 100,30 Q75,30 70,60 Z" fill="#2E1B63" />
                <path d="M72,55 Q85,75 82,85" stroke="#2E1B63" strokeWidth="3" fill="none" />
                <path d="M128,55 Q115,75 118,85" stroke="#2E1B63" strokeWidth="3" fill="none" />
                <path d="M96,33 Q92,45 94,58" stroke="#2DD4BF" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.55" />

                {/* Purple blazer with teal piping */}
                <path d="M60,130 Q100,120 140,130 L150,240 L50,240 Z" fill="#5B21B6" stroke="#2DD4BF" strokeWidth="1.2" strokeOpacity="0.5" />
                <path d="M62,132 L58,236 M138,132 L142,236" stroke="#2DD4BF" strokeWidth="1.2" strokeOpacity="0.4" fill="none" />

                {/* Inner shirt & small blue tie */}
                <path d="M90,130 L110,130 L100,155 Z" fill="#FFFFFF" />
                <path d="M97,155 L103,155 L105,180 L100,190 L95,180 Z" fill="#2DD4BF" />

                {/* Glowing AI badge on the chest */}
                <circle cx="72" cy="142" r="5" fill="#2DD4BF" className="badge-glow" opacity="0.7" />
                <circle cx="72" cy="142" r="2" fill="#F5F3FF" />

                {/* Name tag */}
                <rect x="108" y="145" width="34" height="11" rx="2.5" fill="#F5F3FF" opacity="0.95" />
                <text x="125" y="153" textAnchor="middle" fontSize="6" fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill="#1B1035">
                  LUNA
                </text>

                {/* EXPRESSION STATE: arm — wave (step 1), point-down (step 4), or point-left (default) */}
                {tourStep === 1 ? (
                  <g className="wave-arm">
                    <path d="M60,145 Q40,110 45,75" stroke="#5B21B6" strokeWidth="14" fill="none" strokeLinecap="round" />
                    <path d="M60,145 Q40,110 45,75" stroke="#FCE7F3" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <ellipse cx="45" cy="70" rx="7" ry="8" fill="#FCE7F3" />
                  </g>
                ) : tourStep === 4 ? (
                  <>
                    <path d="M65,145 Q45,175 35,200" stroke="#5B21B6" strokeWidth="14" fill="none" strokeLinecap="round" />
                    <path d="M65,145 Q45,175 35,200" stroke="#FCE7F3" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <path d="M36,198 L18,245" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M19,243 L17,247" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M65,140 Q40,150 20,165" stroke="#5B21B6" strokeWidth="14" fill="none" strokeLinecap="round" />
                    <path d="M65,140 Q40,150 20,165" stroke="#FCE7F3" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <path d="M22,163 L-35,185" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M-33,184 L-37,186" stroke="#FBBF24" strokeWidth="4.5" strokeLinecap="round" />
                  </>
                )}
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6 relative z-10">
        <div className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
          EduSense
        </div>
        <div className="hidden md:flex items-center gap-8 font-body text-sm text-[#A78BCA]">
          <a href="#pipeline" className="hover:text-[#F5F3FF] transition-colors">How it works</a>
          <a href="#features" className="hover:text-[#F5F3FF] transition-colors">Features</a>
        </div>
        <div className={`flex items-center gap-3 font-body text-sm transition-all duration-300 rounded-xl p-1 ${tourStep === 5 ? "ring-4 ring-[#FBBF24] bg-[#2A1B54] scale-105 z-20" : ""}`}>
          <a href="/auth/login" className="px-4 py-2 text-[#F5F3FF] hover:text-[#2DD4BF] transition-colors">Log in</a>
          <a href="/auth/register" className="px-4 py-2 rounded-full bg-[#2DD4BF] text-[#1B1035] font-semibold hover:bg-[#5EEAD4] transition-colors shadow-lg">Get started</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 pt-16 pb-28 grid md:grid-cols-2 gap-14 items-center relative">
        <div className={`transition-all duration-300 rounded-2xl p-2 ${tourStep === 1 ? "ring-4 ring-[#2DD4BF] bg-[#2A1B54]/40 z-20" : ""}`}>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#A78BCA] border border-[#3D2B6B] rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" /> NOW MONITORING · LIVE SESSION
          </div>
          <h1 className="font-display font-semibold text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            An AI tutor that notices <span className="text-[#2DD4BF]">when you stop paying attention.</span>
          </h1>
          <p className="font-body text-lg text-[#C9BEEA] max-w-lg mb-9 leading-relaxed">
            EduSense watches attention through the webcam, answers doubts only from your teacher's own notes, and quietly flags who's at risk — before the exam does.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/register" className="px-6 py-3 rounded-full bg-[#FBBF24] text-[#1B1035] font-body font-semibold hover:bg-[#FCD34D] transition-colors shadow-md">Start learning</a>
            <a href="#pipeline" className="px-6 py-3 rounded-full border border-[#3D2B6B] text-[#F5F3FF] font-body hover:border-[#2DD4BF] transition-colors">See how it works</a>
          </div>
        </div>

        {/* Live attention score tracker panel layout */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-72 h-72 rounded-full bg-[#2DD4BF]/10 blur-3xl drift" />
          <div className="relative w-80 bg-[#2A1B54] border border-[#3D2B6B] rounded-3xl p-7 overflow-hidden shadow-2xl">
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
              <div className="font-mono text-4xl font-semibold text-[#2DD4BF] tabular-nums">{score}%</div>
              <div className="font-body text-xs text-[#A78BCA] mt-1">Attention score</div>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[#C9BEEA]"><span>Head pose</span><span className="text-[#2DD4BF]">forward</span></div>
              <div className="flex justify-between text-[#C9BEEA]"><span>Blink rate</span><span className="text-[#2DD4BF]">normal</span></div>
              <div className="flex justify-between text-[#C9BEEA]"><span>Faces detected</span><span className="text-[#2DD4BF]">1</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pipeline Section ── */}
      <section ref={pipelineRef} id="pipeline" className={`max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] transition-all duration-300 ${tourStep === 2 ? "ring-4 ring-[#2DD4BF] bg-[#2A1B54]/20 rounded-3xl z-20" : ""}`}>
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs text-[#FBBF24]">THE LOOP</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3 tracking-tight">Every session runs the same six-step cycle.</h2>
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
      <section ref={featuresRef} id="features" className={`max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] transition-all duration-300 ${tourStep === 3 ? "ring-4 ring-[#2DD4BF] bg-[#2A1B54]/20 rounded-3xl z-20" : ""}`}>
        <div className="mb-14 max-w-xl">
          <span className="font-mono text-xs text-[#2DD4BF]">UNDER THE HOOD</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3 tracking-tight">Four models, one continuous read on the student.</h2>
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
      <section ref={ctaRef} className={`max-w-6xl mx-auto px-6 py-24 border-t border-[#2A1B54] text-center transition-all duration-300 ${tourStep === 5 ? "ring-4 ring-[#FBBF24] bg-[#2A1B54]/30 rounded-3xl z-20" : ""}`}>
        <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tight mb-6 max-w-2xl mx-auto">Give every student a tutor that actually notices them.</h2>
        <a href="/auth/register" className="inline-block px-7 py-3.5 rounded-full bg-[#2DD4BF] text-[#1B1035] font-body font-semibold hover:bg-[#5EEAD4] transition-colors shadow-xl">Create your free account</a>
      </section>

      {/* ── RAG Chatbot Widget Mockup ── */}
      <div className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${tourStep === 4 ? "ring-4 ring-[#2DD4BF] scale-105" : ""}`}>
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
              <div className="bg-[#1B1035] p-3 rounded-xl max-w-[85%] text-[#A78BCA]">Upload class notes or PDFs. I answer questions based strictly on your source materials!</div>
              <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 p-3 rounded-xl max-w-[85%] ml-auto text-right text-[#F5F3FF]">What is linear regression?</div>
              <div className="bg-[#1B1035] p-3 rounded-xl max-w-[85%] text-[#2DD4BF] font-medium">According to Chapter 2 (Page 14): It calculates the linear relationship between variables using line equations...</div>
            </div>
            <div className="p-3 border-t border-[#3D2B6B] bg-[#1B1035] flex gap-2">
              <input type="text" placeholder="Ask about your course materials..." disabled className="bg-[#2A1B54] border border-[#3D2B6B] rounded-lg px-3 py-1.5 text-xs text-[#A78BCA] w-full focus:outline-none" />
              <button className="bg-[#3D2B6B] text-[#F5F3FF] px-3 rounded-lg text-xs font-semibold">Send</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setChatBotOpen(true)} className="w-12 h-12 rounded-full bg-[#2DD4BF] text-[#1B1035] flex items-center justify-center font-bold text-lg shadow-2xl hover:bg-[#5EEAD4] transition-all transform hover:scale-110">💬</button>
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