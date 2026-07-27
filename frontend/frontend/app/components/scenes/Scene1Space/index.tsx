"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { CAMERA } from "./constants";

export default function Scene1Space() {
  return (
    <Canvas
      camera={{
        position: CAMERA.position,
        fov: CAMERA.fov,
      }}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Scene />
    </Canvas>
  );
}