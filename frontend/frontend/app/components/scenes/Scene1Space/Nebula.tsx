"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function NebulaLayer({
  color,
  position,
  scale,
  speed,
}: {
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!mesh.current) return;

    mesh.current.rotation.z = state.clock.elapsedTime * speed;

    mesh.current.material.opacity =
      0.20 +
      Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[scale, scale]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Nebula() {
  return (
    <>
      <NebulaLayer
        color="#4FC3F7"
        position={[-20, 10, -50]}
        scale={80}
        speed={0.01}
      />

      <NebulaLayer
        color="#7C4DFF"
        position={[25, -15, -80]}
        scale={90}
        speed={-0.015}
      />

      <NebulaLayer
        color="#EC407A"
        position={[0, 25, -100]}
        scale={70}
        speed={0.008}
      />

      <NebulaLayer
        color="#00BCD4"
        position={[40, 20, -120]}
        scale={120}
        speed={0.004}
      />
    </>
  );
}