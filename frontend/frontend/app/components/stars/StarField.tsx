"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 15000;
const SPREAD = 400;

export default function StarField() {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);

  // Second layer for depth
  const points2Ref = useRef<THREE.Points>(null!);

  const { positions, positions2 } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const pos2 = new Float32Array(5000 * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute stars all around the camera in a giant sphere
      pos[i * 3] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
    }

    // Bright foreground stars
    for (let i = 0; i < 5000; i++) {
      pos2[i * 3] = (Math.random() - 0.5) * 200;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    return { positions: pos, positions2: pos2 };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // === Flying stars: move toward camera (positive Z) and wrap ===
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const flySpeed = delta * 30;

      for (let i = 0; i < STAR_COUNT; i++) {
        arr[i * 3 + 2] += flySpeed;
        if (arr[i * 3 + 2] > SPREAD * 0.5) {
          arr[i * 3 + 2] = -SPREAD * 0.5;
          arr[i * 3] = (Math.random() - 0.5) * SPREAD;
          arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
        }
      }
      posAttr.needsUpdate = true;

      // Subtle twinkle by oscillating opacity
      if (materialRef.current) {
        materialRef.current.opacity = 0.7 + Math.sin(t * 2) * 0.15;
      }
    }

    // Second layer: slow rotation
    if (points2Ref.current) {
      points2Ref.current.rotation.y = t * 0.02;
      points2Ref.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    }
  });

  return (
    <>
      {/* Primary starfield — white flying stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          color="#ffffff"
          size={1.2}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Second layer — warm-tinted larger stars */}
      <points ref={points2Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions2, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#aaccff"
          size={2.0}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
