"use client";

import { SpeechController, TOUR_STEPS, TourScriptStep } from "./SpeechController";
import { AnimationController, AvatarAnimState } from "./AnimationController";

export class TourController {
  private currentStepIndex: number | null = null;
  private speechController: SpeechController;
  private animController: AnimationController;
  private isAutoPlaying = false;
  private listeners: Set<(step: number | null, script?: TourScriptStep) => void> = new Set();

  constructor(animController: AnimationController) {
    this.animController = animController;
    this.speechController = SpeechController.getInstance();

    // Listen to entry walk completion
    this.animController.setOnStateComplete((state) => {
      if (state === "stop" && this.currentStepIndex === null) {
        // Start Step 1 automatically after entering and stopping
        this.startTour();
      }
    });
  }

  public subscribe(callback: (step: number | null, script?: TourScriptStep) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const currentScript =
      this.currentStepIndex !== null ? TOUR_STEPS[this.currentStepIndex] : undefined;
    this.listeners.forEach((cb) => cb(this.currentStepIndex !== null ? this.currentStepIndex + 1 : null, currentScript));
  }

  public getCurrentStep(): number | null {
    return this.currentStepIndex !== null ? this.currentStepIndex + 1 : null;
  }

  public getCurrentScript(): TourScriptStep | undefined {
    return this.currentStepIndex !== null ? TOUR_STEPS[this.currentStepIndex] : undefined;
  }

  public startTour() {
    this.setStep(0);
  }

  public nextStep() {
    if (this.currentStepIndex === null) {
      this.startTour();
      return;
    }

    if (this.currentStepIndex < TOUR_STEPS.length - 1) {
      this.setStep(this.currentStepIndex + 1);
    } else {
      // Finished tour!
      this.completeTour();
    }
  }

  public previousStep() {
    if (this.currentStepIndex !== null && this.currentStepIndex > 0) {
      this.setStep(this.currentStepIndex - 1);
    }
  }

  public setStep(index: number) {
    if (index < 0 || index >= TOUR_STEPS.length) return;

    this.currentStepIndex = index;
    const stepData = TOUR_STEPS[index];

    // Trigger state animation matching the tour step
    this.animController.setState(stepData.animationState);
    this.notify();

    // Auto-scroll page to relevant section
    this.scrollToSection(stepData.targetRef);

    // Trigger speech synthesis dialogue
    this.speechController.speak(stepData.text, () => {
      // Speech finished for this step
      if (this.currentStepIndex === index) {
        if (index === TOUR_STEPS.length - 1) {
          this.animController.setState("celebrate");
          setTimeout(() => {
            this.animController.setState("idle");
          }, 3000);
        } else {
          this.animController.setState("idle");
        }
      }
    });
  }

  public skipTour() {
    this.currentStepIndex = null;
    this.speechController.cancel();
    this.animController.setState("idle");
    this.notify();
  }

  public completeTour() {
    this.currentStepIndex = null;
    this.speechController.cancel();
    this.animController.setState("celebrate");
    setTimeout(() => {
      this.animController.setState("idle");
    }, 2500);
    this.notify();
  }

  private scrollToSection(targetRef?: string) {
    if (typeof window === "undefined" || !targetRef) return;

    switch (targetRef) {
      case "pipeline": {
        const el = document.getElementById("pipeline");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
      case "features": {
        const el = document.getElementById("features");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
      case "chatbot": {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        break;
      }
      case "register": {
        window.scrollTo({ top: document.body.scrollHeight - 600, behavior: "smooth" });
        break;
      }
      default:
        break;
    }
  }
}