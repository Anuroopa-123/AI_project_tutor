"use client";

import { useThree } from "@react-three/fiber";
import { Color, FogExp2 } from "three";
import { useEffect } from "react";

export default function Environment() {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color("#020207");

    scene.fog = new FogExp2("#020207", 0.0025);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.35} />

      <pointLight
        position={[20, 20, 20]}
        intensity={12}
        color="#6EC5FF"
      />

      <pointLight
        position={[-20, -10, -20]}
        intensity={8}
        color="#8A5CFF"
      />
    </>
  );
}