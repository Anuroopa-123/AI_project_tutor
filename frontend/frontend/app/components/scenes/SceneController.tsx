"use client";

import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Scene 1 Components ───
import CameraRig from "./Scene1Space/CameraRig";
import SpaceDust from "./Scene1Space/SpaceDust";
import Nebula from "./Scene1Space/Nebula";
import Planet from "../planets/Planet";

// ─── Scene 2 Components ───
import Scene2 from "./Scene2";

// ─── Overlays ───
import Logo from "./Scene1Space/Logo";

// ─── Stars (inline for zero-shader-dependency reliability) ───
import StarField from "../stars/StarField";

export default function SceneController() {
  const [sceneStage, setSceneStage] = useState(1);
  const [avatarActive, setAvatarActive] = useState(false);

  const goToScene2 = useCallback(() => {
    setSceneStage(2);
    setTimeout(() => setAvatarActive(true), 600);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      {/* ─── R3F Canvas ─── */}
      <Canvas
        camera={{ position: [0, 0, 80], fov: 60, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          inset: 0,
        }}
      >
        {/* Sky background */}
        <color attach="background" args={["#020209"]} />

        {/* Ambient light so MeshStandard surfaces are visible */}
        <ambientLight intensity={0.4} />

        {/* Camera auto-flight + mouse parallax */}
        <CameraRig />

        {/* ─── Always-visible space environment ─── */}
        <StarField />
        <Nebula />
        <SpaceDust />
        <Planet position={[28, -16, -50]} scale={0.9} />

        {/* ─── Scene 2: Holographic Ring + Avatar ─── */}
        {sceneStage >= 2 && (
          <Scene2 progress={avatarActive ? 1.0 : 0.2} />
        )}

        {/* Post processing - gentle bloom */}
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={0.8}
            luminanceThreshold={0.1}
            radius={0.6}
          />
        </EffectComposer>
      </Canvas>

      {/* ─── HTML Overlays ─── */}

      {/* Stage 1: Logo + CTA */}
      {sceneStage === 1 && <Logo />}

      {/* Stage 2: Avatar speech card */}
      {sceneStage === 2 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center px-4">
          <div className="px-6 py-4 rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl text-white max-w-md shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-mono text-xs uppercase tracking-wider">
                Luna AI Co-Pilot Online
              </span>
            </div>
            <p className="text-sm text-slate-200 font-light">
              &quot;Welcome to Nova AI Workspace. I am Luna, your autonomous
              co-pilot. How can I assist your workflow today?&quot;
            </p>
          </div>

          <a
            href="/auth/login"
            className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-medium tracking-wide hover:brightness-125 transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] pointer-events-auto"
          >
            Enter Nova AI Workspace →
          </a>
        </div>
      )}

      {/* ─── Bottom Controls ─── */}
      <div className="absolute bottom-6 right-8 z-30 flex items-center space-x-4">
        {sceneStage === 1 && (
          <button
            onClick={goToScene2}
            className="px-6 py-2.5 rounded-full border border-cyan-400/40 bg-cyan-950/60 backdrop-blur-md text-cyan-300 hover:text-white hover:border-cyan-300 transition-all font-mono text-xs uppercase tracking-widest pointer-events-auto shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            Awaken AI Avatar ✨
          </button>
        )}
        <div className="flex items-center space-x-2">
          <span
            onClick={() => {
              setSceneStage(1);
              setAvatarActive(false);
            }}
            title="Scene 1: Space"
            className={`w-3 h-3 rounded-full cursor-pointer transition-all pointer-events-auto ${
              sceneStage === 1
                ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                : "bg-slate-700 hover:bg-slate-500"
            }`}
          />
          <span
            onClick={() => {
              setSceneStage(2);
              setAvatarActive(true);
            }}
            title="Scene 2: AI Avatar"
            className={`w-3 h-3 rounded-full cursor-pointer transition-all pointer-events-auto ${
              sceneStage === 2
                ? "bg-purple-400 shadow-[0_0_8px_#c084fc]"
                : "bg-slate-700 hover:bg-slate-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
