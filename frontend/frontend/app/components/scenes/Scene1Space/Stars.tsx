"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 12000;
const RADIUS = 250;

export default function Stars() {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const array = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = Math.random() * RADIUS;

      const theta = Math.random() * Math.PI * 2;

      const phi = Math.acos(2 * Math.random() - 1);

      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);

      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);

      array[i * 3 + 2] = r * Math.cos(phi);
    }

    return array;
  }, []);

  useFrame((state) => {
    if (!points.current) return;

    points.current.rotation.y = state.clock.elapsedTime * 0.01;

    points.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="white"
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}