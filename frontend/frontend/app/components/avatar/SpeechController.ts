"use client";

import type { AvatarAnimState } from "./AnimationController";

export type TourScriptStep = {
  text: string;
  animationState: AvatarAnimState;
  targetRef?: "pipeline" | "features" | "chatbot" | "register";
};

// One entry per tour stop. `animationState` drives where she walks to
// and which gesture she plays (see FLOOR_X / POSES in
// AnimationController.ts); `targetRef` drives which section of the
// page scrolls into view underneath her.
export const TOUR_STEPS: TourScriptStep[] = [
  {
    text:
      "Hi! I'm Luna, your EduSense AI Tutor. Welcome — let me give you a quick tour of how this platform transforms how you study and take exams.",
    animationState: "wave",
  },
  {
    text:
      "EduSense uses your webcam to read engagement and detect drowsiness in real time — it actually adapts to how you learn.",
    animationState: "point-hero",
  },
  {
    text:
      "Over here — advanced proctoring, a predictive risk model, and a reinforcement-learning agent that keeps quiz difficulty in your perfect zone.",
    animationState: "point-features",
    targetRef: "features",
  },
  {
    text:
      "My favorite part — the knowledge chatbot. Upload your notes and ask anything; answers come only from your own material.",
    animationState: "point-chatbot",
    targetRef: "chatbot",
  },
  {
    text: "Before you explore on your own, quickly create an account. Ready to supercharge your learning? Let's go!",
    animationState: "point-register",
    targetRef: "register",
  },
];

type Listener = (isSpeaking: boolean, mouthLevel: number) => void;

/**
 * SpeechController
 * ------------------------------------------------------------------
 * Singleton so both LunaAvatar (which needs live speaking/mouthLevel
 * updates for lip sync) and TourController (which just wants to fire
 * a line and get a completion callback) share the same instance.
 *
 * Lip sync here is an APPROXIMATION: browser `speechSynthesis` does
 * not expose the underlying audio buffer, so there's no true
 * waveform to analyze. Instead we pulse mouthLevel on each
 * `onboundary` event (fires per word) and let it decay between
 * words. It reads as talking at a glance; it is not phoneme-accurate.
 * If you swap in a server TTS (Azure/Polly/ElevenLabs) later, drive
 * mouthLevel from real amplitude via an AnalyserNode instead — same
 * `subscribe` contract, just a better data source underneath.
 */
export class SpeechController {
  private static instance: SpeechController | null = null;
  static getInstance(): SpeechController {
    if (!SpeechController.instance) {
      SpeechController.instance = new SpeechController();
    }
    return SpeechController.instance;
  }

  private listeners = new Set<Listener>();
  private mouthLevel = 0;
  private mouthTarget = 0;
  private isSpeaking = false;
  private decayInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isSpeaking, this.mouthLevel));
  }

  private startDecayLoop() {
    if (this.decayInterval) return;
    this.decayInterval = setInterval(() => {
      this.mouthLevel += (this.mouthTarget - this.mouthLevel) * 0.35;
      this.notify();
    }, 40);
  }

  private stopDecayLoop() {
    if (this.decayInterval) {
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }
  }

  /** Speak a line; onDone fires once (on natural end, error, or cancel). */
  speak(text: string, onDone?: () => void) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onDone?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Google US English") || v.lang.startsWith("en")
    );
    if (preferred) utterance.voice = preferred;
    utterance.rate = 1.05;
    utterance.pitch = 1.2;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startDecayLoop();
      this.notify();
    };

    utterance.onboundary = () => {
      this.mouthTarget = 0.35 + Math.random() * 0.5;
      if (Math.random() < 0.15) this.mouthTarget = Math.min(1, this.mouthTarget + 0.3);
    };

    const finish = () => {
      this.isSpeaking = false;
      this.mouthTarget = 0;
      this.stopDecayLoop();
      this.mouthLevel = 0;
      this.notify();
      onDone?.();
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    window.speechSynthesis.speak(utterance);
  }

  cancel() {
    window.speechSynthesis?.cancel();
    this.isSpeaking = false;
    this.mouthTarget = 0;
    this.mouthLevel = 0;
    this.stopDecayLoop();
    this.notify();
  }
}