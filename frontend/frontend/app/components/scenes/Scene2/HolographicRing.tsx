"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HolographicRingProps {
  progress?: number;
  position?: [number, number, number];
}

export default function HolographicRing({
  progress = 1.0,
  position = [0, 0, 0],
}: HolographicRingProps) {
  const ringRef = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const particleGroupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.5 + Math.sin(t * 2) * 0.15) * progress;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.25;
      const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.35 + Math.sin(t * 1.5 + 1) * 0.1) * progress;
    }

    if (particleGroupRef.current) {
      particleGroupRef.current.rotation.z -= delta * 0.6;
    }
  });

  return (
    <group position={position}>
      {/* Outer holographic ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[12, 14, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.5 * progress}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner ring accent */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[9, 11.5, 64]} />
        <meshBasicMaterial
          color="#e040fb"
          transparent
          opacity={0.35 * progress}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting particles around the ring */}
      <group ref={particleGroupRef}>
        {Array.from({ length: 28 }).map((_, i) => {
          const angle = (i / 28) * Math.PI * 2;
          const radius = 13;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0,
              ]}
            >
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? "#00f0ff" : i % 3 === 1 ? "#f472b6" : "#a855f7"}
                transparent
                opacity={0.75 * progress}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
