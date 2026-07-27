"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SceneController from "./SceneController";

export default function CanvasEngine() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, 0, 40],
        fov: 60,
        near: 0.1,
        far: 2000,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Suspense fallback={null}>
        <SceneController />
      </Suspense>
    </Canvas>
  );
}