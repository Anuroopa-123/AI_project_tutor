"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaLayerProps {
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
  opacity?: number;
}

function NebulaLayer({
  color,
  position,
  scale,
  speed,
  opacity = 0.25,
}: NebulaLayerProps) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * speed;
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity =
      opacity + Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.08;
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Nebula() {
  return (
    <>
      {/* Large violet background cloud */}
      <NebulaLayer
        color="#7b2cbf"
        position={[0, 10, -80]}
        scale={180}
        speed={0.008}
        opacity={0.2}
      />

      {/* Cyan gas filament */}
      <NebulaLayer
        color="#4FC3F7"
        position={[-30, 15, -60]}
        scale={120}
        speed={-0.012}
        opacity={0.22}
      />

      {/* Magenta starburst */}
      <NebulaLayer
        color="#EC407A"
        position={[35, -10, -100]}
        scale={140}
        speed={0.01}
        opacity={0.18}
      />

      {/* Deep teal distant atmosphere */}
      <NebulaLayer
        color="#00BCD4"
        position={[20, 25, -120]}
        scale={200}
        speed={0.004}
        opacity={0.15}
      />

      {/* Dark purple deep field */}
      <NebulaLayer
        color="#3f37c9"
        position={[0, 0, -160]}
        scale={300}
        speed={0.002}
        opacity={0.12}
      />
    </>
  );
}