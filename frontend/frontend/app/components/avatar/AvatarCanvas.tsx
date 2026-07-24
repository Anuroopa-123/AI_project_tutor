"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import LunaAvatar, { LoadStatus } from "./LunaAvatar";
import { AnimationController } from "./AnimationController";

interface AvatarCanvasProps {
  animController: AnimationController;
  modelUrl?: string;
  className?: string;
  /** Shows bounding-box gizmo + lets you orbit the camera. Dev only. */
  debug?: boolean;
}

/**
 * CAMERA MATH — unchanged from before, still centers a 1.6m-tall
 * model whose vertical midpoint sits at y = -0.2. The avatar now
 * walks between x ≈ -1.5 and x ≈ 1.3 depending on which gesture
 * she's performing, so ContactShadows and the directional-light
 * shadow frustum below are widened to cover that whole range instead
 * of just a single centered stance.
 */
const CAMERA_POSITION: [number, number, number] = [0, -0.2, 3.4];
const CAMERA_FOV = 32;
const SHADOW_CENTER: [number, number, number] = [0, -1.0, 0];

export default function AvatarCanvas({
  animController,
  modelUrl = "/avatar/AvatarSample_A.vrm",
  className = "",
  debug = false,
}: AvatarCanvasProps) {
  const [isDev, setIsDev] = useState(false);
  const [status, setStatus] = useState<LoadStatus>({ state: "loading", message: "Starting…" });

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development");
  }, []);

  return (
    // Fills whatever parent gives it — page.tsx now makes the hero
    // section itself the full-bleed container, e.g. `h-screen`.
    <div className={`relative w-full h-full select-none ${className}`}>
      {status.state !== "ready" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-xl font-mono text-xs border backdrop-blur-sm max-w-xs text-center ${
              status.state === "error"
                ? "bg-[#FBBF24]/10 border-[#FBBF24]/40 text-[#FBBF24]"
                : "bg-[#2A1B54]/60 border-[#3D2B6B] text-[#A78BCA]"
            }`}
          >
            {status.state === "loading" ? status.message : `⚠ ${status.message}`}
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        shadows
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.1} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={15}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#2DD4BF" />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <Suspense fallback={null}>
          <LunaAvatar
            animController={animController}
            modelUrl={modelUrl}
            onStatusChange={setStatus}
            debug={debug}
          />
        </Suspense>

        <ContactShadows position={SHADOW_CENTER} opacity={0.55} scale={6} blur={1.8} far={4} color="#1B1035" />

        {isDev && debug && <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.05} />}
      </Canvas>
    </div>
  );
}