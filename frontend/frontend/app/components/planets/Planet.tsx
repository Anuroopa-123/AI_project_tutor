"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Planet({
  position = [25, -18, -60],
  scale = 1.0,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.06;
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.1;
      cloudsRef.current.rotation.x += delta * 0.015;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.04;
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Core planet sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshStandardMaterial
          color="#0a0e27"
          emissive="#1a237e"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Cybernetic wireframe grid overlay */}
      <mesh>
        <sphereGeometry args={[12.15, 40, 40]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[12.5, 48, 48]} />
        <meshStandardMaterial
          color="#42a5f5"
          emissive="#7c4dff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer atmospheric glow (BackSide = Fresnel-like rim) */}
      <mesh>
        <sphereGeometry args={[13.5, 32, 32]} />
        <meshBasicMaterial
          color="#00bcd4"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.8, Math.PI / 7, 0]}>
        <ringGeometry args={[16, 22, 64]} />
        <meshBasicMaterial
          color="#f06292"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Lighting for planet surface */}
      <directionalLight
        position={[25, 15, 15]}
        color="#64b5f6"
        intensity={4}
      />
      <pointLight
        position={[-20, -10, -15]}
        color="#ab47bc"
        intensity={3}
      />
    </group>
  );
}

