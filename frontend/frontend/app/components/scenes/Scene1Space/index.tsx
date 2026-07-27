"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import Logo from "./Logo";
import { CAMERA } from "./constants";

export default function Scene1Space() {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <Canvas
        camera={{
          position: CAMERA.position,
          fov: CAMERA.fov,
        }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <Scene />
      </Canvas>

      <Logo />
    </div>
  );
}