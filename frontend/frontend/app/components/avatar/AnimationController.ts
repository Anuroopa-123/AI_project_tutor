"use client";

import * as THREE from "three";
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";

export type AvatarAnimState =
  | "enter"
  | "walk"
  | "stop"
  | "wave"
  | "talk"
  | "point-hero"
  | "point-features"
  | "point-chatbot"
  | "point-register"
  | "idle"
  | "celebrate"
  | "thinking";

type BonePose = Partial<Record<VRMHumanBoneName, [number, number, number]>>;

// ── Hand-authored gesture poses ──────────────────────────────────────
// These are what she does once she ARRIVES somewhere. "walk" is what
// plays automatically any time she's actually moving, regardless of
// which state she's walking toward.
const POSES: Record<string, BonePose> = {
  idle: {
    leftUpperArm: [0, 0, 1.2],
    rightUpperArm: [0, 0, -1.2],
    leftLowerArm: [0, 0, 0.15],
    rightLowerArm: [0, 0, -0.15],
    head: [0, 0, 0],
    spine: [0, 0, 0],
  },
  walk: {
    leftUpperArm: [0.3, 0, 1.15],
    rightUpperArm: [-0.3, 0, -1.15],
    leftLowerArm: [0, 0, 0.25],
    rightLowerArm: [0, 0, -0.25],
    spine: [0, 0, 0],
    head: [0, 0.1, 0],
  },
  wave: {
    rightUpperArm: [-1.0, 0.1, -0.35],
    rightLowerArm: [-0.2, 0.2, -1.5],
    rightHand: [0, 0, 0.3],
    leftUpperArm: [0, 0, 1.2],
    spine: [0, 0.05, 0.05],
    head: [0, -0.1, 0],
  },
  talk: {
    leftUpperArm: [0, 0, 1.2],
    rightUpperArm: [-0.3, 0.1, -0.6],
    rightLowerArm: [-0.1, 0, -0.4],
    head: [0, 0, 0],
  },
  pointing: {
    rightUpperArm: [0, 0.4, -1.05],
    rightLowerArm: [0, 0.05, -0.15],
    leftUpperArm: [0, 0, 1.2],
    spine: [0, -0.12, 0],
    head: [0, -0.15, 0],
  },
  celebrate: {
    rightUpperArm: [-1.2, 0, -0.4],
    leftUpperArm: [-1.2, 0, 0.4],
    rightLowerArm: [0, 0, -0.3],
    leftLowerArm: [0, 0, 0.3],
    head: [-0.1, 0, 0],
  },
  thinking: {
    rightUpperArm: [-0.9, 0.3, -0.5],
    rightLowerArm: [-1.8, 0, -0.3],
    rightHand: [0, 0, 0],
    leftUpperArm: [0, 0, 1.2],
    head: [0.1, -0.15, 0.05],
  },
};

function stateToPoseKey(state: AvatarAnimState): keyof typeof POSES {
  switch (state) {
    case "enter":
    case "walk":
      return "walk";
    case "stop":
    case "idle":
      return "idle";
    case "wave":
      return "wave";
    case "celebrate":
      return "celebrate";
    case "talk":
      return "talk";
    case "point-hero":
    case "point-features":
    case "point-chatbot":
    case "point-register":
      return "pointing";
    case "thinking":
      return "thinking";
    default:
      return "idle";
  }
}

// ── Where she walks TO for each state, and which way she faces once
// she gets there. This is what makes it read as "walking around and
// gesturing" instead of "standing in one spot swapping arm poses".
const FLOOR_X: Partial<Record<AvatarAnimState, number>> = {
  idle: 0,
  stop: 0,
  talk: 0,
  wave: 0.55,
  "point-hero": 0.9,
  "point-features": -0.9,
  "point-chatbot": -1.5,
  "point-register": 1.3,
  celebrate: 0,
  thinking: -0.4,
};

const ARRIVAL_FACING: Partial<Record<AvatarAnimState, number>> = {
  "point-hero": 0.1,
  "point-features": -0.25,
  "point-chatbot": -0.45,
  "point-register": 0.3,
};

const WALK_SPEED = 1.25; // world units per second
const ARRIVE_EPSILON = 0.02;

export class AnimationController {
  private currentState: AvatarAnimState = "enter";

  private position = new THREE.Vector3(3.2, -1.0, 0);
  private targetPosition = new THREE.Vector3(0, -1.0, 0);
  private rotationY = -0.3;

  // Which pose is currently being displayed/blended toward — separate
  // from `currentState` because "what pose plays" depends on whether
  // she's moving right now, not just which state was requested.
  private displayedPoseKey: keyof typeof POSES = "walk";
  private prevPoseKey: keyof typeof POSES = "walk";
  private blend = 1;
  private blendDuration = 0.5;

  private isBlinking = false;
  private blinkTimer = 0;
  private nextBlinkTime = 3;
  private blinkProgress = 0;

  private celebrateTime = 0;
  private clock = 0;

  private onStateCompleteCallback?: (state: AvatarAnimState) => void;
  private onStateChangeCallback?: (newState: AvatarAnimState) => void;

  public getState(): AvatarAnimState {
    return this.currentState;
  }

  public setState(state: AvatarAnimState) {
    if (this.currentState === state) return;
    this.currentState = state;
    this.targetPosition.x = FLOOR_X[state] ?? 0;
    this.onStateChangeCallback?.(state);
  }

  public setOnStateComplete(cb: (state: AvatarAnimState) => void) {
    this.onStateCompleteCallback = cb;
  }

  public setOnStateChange(cb: (newState: AvatarAnimState) => void) {
    this.onStateChangeCallback = cb;
  }

  private setDisplayedPose(key: keyof typeof POSES) {
    if (key === this.displayedPoseKey) return;
    this.prevPoseKey = this.displayedPoseKey;
    this.displayedPoseKey = key;
    this.blend = 0;
    this.blendDuration = key === "wave" || key === "celebrate" ? 0.35 : 0.5;
  }

  public update(
    delta: number,
    clockTime: number,
    vrm: VRM | null,
    mouthLevel: number = 0,
    isSpeaking: boolean = false
  ): { position: THREE.Vector3; rotationY: number } {
    this.clock += delta;

    let isMoving = false;

    if (this.currentState === "celebrate") {
      // Small happy bounce in place — NOT a big jump. This replaced
      // the 0.12-unit hop that read as "jumping".
      this.celebrateTime += delta * 6;
      const bounce = Math.abs(Math.sin(this.celebrateTime)) * 0.04;
      this.position.y = -1.0 + bounce;
      this.position.x = THREE.MathUtils.lerp(this.position.x, this.targetPosition.x, delta * 5);
      this.rotationY = THREE.MathUtils.lerp(this.rotationY, 0, delta * 6);
    } else {
      const dx = this.targetPosition.x - this.position.x;
      const dist = Math.abs(dx);
      isMoving = dist > ARRIVE_EPSILON;

      if (isMoving) {
        const step = Math.sign(dx) * Math.min(WALK_SPEED * delta, dist);
        this.position.x += step;
        const facing = dx > 0 ? -0.3 : 0.3;
        this.rotationY = THREE.MathUtils.lerp(this.rotationY, facing, delta * 6);
      } else {
        this.position.x = this.targetPosition.x;
        const facing = ARRIVAL_FACING[this.currentState] ?? 0;
        this.rotationY = THREE.MathUtils.lerp(this.rotationY, facing, delta * 6);

        // Only the initial walk-in auto-advances state on arrival —
        // everything else just holds its gesture pose until the tour
        // explicitly requests a new state.
        if (this.currentState === "enter") {
          this.setState("stop");
          this.onStateCompleteCallback?.("stop");
        }
      }

      // Small idle vertical bob so she's not perfectly frozen at rest.
      const restBob = !isMoving ? Math.sin(this.clock * 1.4) * 0.008 : 0;
      const walkBob = isMoving ? Math.abs(Math.sin(this.clock * 7)) * 0.03 : 0;
      this.position.y = -1.0 + restBob + walkBob;
    }

    // Decide which gesture pose should be showing: walking always
    // shows the walk pose; otherwise show whatever the current state
    // maps to.
    const desiredPoseKey = isMoving ? "walk" : stateToPoseKey(this.currentState);
    this.setDisplayedPose(desiredPoseKey);

    // ── Bone pose blending + facial expressions ──
    if (vrm?.humanoid) {
      this.blend = Math.min(1, this.blend + delta / this.blendDuration);
      const eased = THREE.MathUtils.smoothstep(this.blend, 0, 1);

      const from = POSES[this.prevPoseKey];
      const to = POSES[this.displayedPoseKey];

      const breathe = Math.sin(this.clock * 1.1) * 0.02;
      const sway = Math.sin(this.clock * 0.6) * 0.03;
      const walkPhase = this.clock * 7;
      const legSwing = isMoving ? Math.sin(walkPhase) * 0.35 : 0;

      const boneNames = new Set<VRMHumanBoneName>([
        ...(Object.keys(from) as VRMHumanBoneName[]),
        ...(Object.keys(to) as VRMHumanBoneName[]),
        "leftUpperLeg",
        "rightUpperLeg",
        "chest",
      ]);

      for (const boneName of boneNames) {
        const node = vrm.humanoid.getNormalizedBoneNode(boneName);
        if (!node) continue;

        const a = from[boneName] ?? [0, 0, 0];
        const b = to[boneName] ?? [0, 0, 0];

        let x = THREE.MathUtils.lerp(a[0], b[0], eased);
        let y = THREE.MathUtils.lerp(a[1], b[1], eased);
        let z = THREE.MathUtils.lerp(a[2], b[2], eased);

        if (boneName === "head") {
          x += Math.sin(this.clock * 0.5) * 0.03;
          y += Math.sin(this.clock * 0.35) * 0.04;
        }
        if (boneName === "chest") {
          x += breathe;
          y += sway;
        }
        if (boneName === "leftUpperLeg") x += legSwing;
        if (boneName === "rightUpperLeg") x -= legSwing;

        node.rotation.set(x, y, z);
      }

      const em = vrm.expressionManager;
      if (em) {
        this.blinkTimer += delta;
        if (this.blinkTimer > this.nextBlinkTime) {
          this.isBlinking = true;
          this.blinkProgress += delta * 12;
          if (this.blinkProgress >= Math.PI) {
            this.isBlinking = false;
            this.blinkProgress = 0;
            this.blinkTimer = 0;
            this.nextBlinkTime = 2.2 + Math.random() * 3.5;
          }
        }
        const blinkValue = this.isBlinking ? Math.sin(this.blinkProgress) : 0;
        em.setValue("blink", blinkValue);

        const mouth = isSpeaking ? mouthLevel : 0;
        em.setValue("aa", mouth);
        em.setValue("ih", mouth * 0.4);

        const isHappy =
          this.currentState === "stop" ||
          this.currentState === "wave" ||
          this.currentState === "celebrate";
        em.setValue("happy", isHappy ? 0.8 : 0.15);
        em.update();
      }
    }

    return { position: this.position, rotationY: this.rotationY };
  }
}