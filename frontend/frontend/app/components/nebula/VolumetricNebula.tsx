"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "../shaders/nebula/NebulaMaterial";

interface CloudLayerProps {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  colorCore: string;
  colorMid: string;
  colorOuter: string;
  density?: number;
  speed?: number;
}

function NebulaCloudLayer({
  position,
  scale,
  rotation = [0, 0, 0],
  colorCore,
  colorMid,
  colorOuter,
  density = 0.5,
  speed = 0.05,
}: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed * 0.05;
      meshRef.current.rotation.y += delta * speed * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <nebulaShaderMaterial
        ref={materialRef}
        uTime={0}
        uColorCore={new THREE.Color(colorCore)}
        uColorMid={new THREE.Color(colorMid)}
        uColorOuter={new THREE.Color(colorOuter)}
        uDensity={density}
        uSpeed={speed}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function VolumetricNebula() {
  return (
    <group>
      {/* Primary Cosmic Violet & Blue Heart */}
      <NebulaCloudLayer
        position={[0, 5, -80]}
        scale={[180, 180, 1]}
        colorCore="#c77dff"
        colorMid="#7b2cbf"
        colorOuter="#10002b"
        density={0.65}
        speed={0.06}
      />

      {/* Deep Electric Cyan Gas Filament */}
      <NebulaCloudLayer
        position={[-35, 20, -120]}
        scale={[220, 220, 1]}
        rotation={[0, 0, Math.PI / 4]}
        colorCore="#70e000"
        colorMid="#00b4d8"
        colorOuter="#03045e"
        density={0.45}
        speed={-0.04}
      />

      {/* Radiant Pink & Magenta Starburst Cloud */}
      <NebulaCloudLayer
        position={[40, -15, -100]}
        scale={[200, 200, 1]}
        rotation={[0, 0, -Math.PI / 6]}
        colorCore="#ff9e00"
        colorMid="#ff007f"
        colorOuter="#3a0ca3"
        density={0.5}
        speed={0.08}
      />

      {/* Distant Deep Atmosphere Background Shield */}
      <NebulaCloudLayer
        position={[0, 0, -180]}
        scale={[350, 350, 1]}
        colorCore="#480ca8"
        colorMid="#3f37c9"
        colorOuter="#000000"
        density={0.3}
        speed={0.02}
      />
    </group>
  );
}
