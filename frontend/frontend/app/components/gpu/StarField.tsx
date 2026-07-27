"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "../shaders/star/StarMaterial";

interface StarFieldProps {
  count?: number;
  radius?: number;
  speed?: number;
}

export default function StarField({
  count = 15000,
  radius = 300,
  speed = 0.05,
}: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, sizes, colors, twinkleSpeeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const twSpd = new Float32Array(count);
    const phs = new Float32Array(count);

    const starPalette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#d0e2ff"),
      new THREE.Color("#91caff"),
      new THREE.Color("#ffd8a8"),
      new THREE.Color("#ffc9c9"),
      new THREE.Color("#eebefa"),
    ];

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.5) * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;

      sz[i] = Math.random() > 0.95 ? Math.random() * 2.5 + 2.0 : Math.random() * 1.2 + 0.6;

      const colorSample = starPalette[Math.floor(Math.random() * starPalette.length)];
      col[i * 3] = colorSample.r;
      col[i * 3 + 1] = colorSample.g;
      col[i * 3 + 2] = colorSample.b;

      twSpd[i] = Math.random() * 4.0 + 1.5;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, sizes: sz, colors: col, twinkleSpeeds: twSpd, phases: phs };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.01 * speed;
      pointsRef.current.rotation.y += delta * 0.005 * speed;

      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const zSpeed = delta * 15 * speed;

      for (let i = 0; i < count; i++) {
        array[i * 3 + 2] += zSpeed;
        if (array[i * 3 + 2] > 150) {
          array[i * 3 + 2] = -radius;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>

      <starShaderMaterial
        ref={materialRef}
        uTime={0}
        uPixelRatio={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        uBaseSize={25}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}