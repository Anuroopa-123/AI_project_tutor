"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HolographicAvatarProps {
  progress?: number;
  position?: [number, number, number];
}

export default function HolographicAvatar({
  progress = 1.0,
  position = [0, -2, 0],
}: HolographicAvatarProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const { pointer } = useThree();

  // Generate procedural 3D particles forming an AI Avatar Head & Shoulders Bust
  const { positions, originalPositions, colors, sizes } = useMemo(() => {
    const count = 7500;
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const cyan = new THREE.Color("#00f0ff");
    const magenta = new THREE.Color("#f472b6");
    const violet = new THREE.Color("#a855f7");

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;
      let colorSample = cyan;

      if (i < 3500) {
        // Head sphere & face features
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 2.8 + Math.random() * 0.4;

        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.cos(phi) + 4.5;
        z = radius * Math.sin(phi) * Math.sin(theta);

        // Highlight eyes & smiling mouth region with glowing magenta
        if (y > 4.2 && y < 5.2 && z > 1.8) {
          colorSample = magenta;
        } else {
          colorSample = Math.random() > 0.4 ? cyan : violet;
        }
      } else if (i < 5500) {
        // Neck and Collarbone
        const theta = Math.random() * Math.PI * 2;
        const radius = 1.6 + Math.random() * 0.5;
        x = radius * Math.cos(theta);
        y = (Math.random() - 0.5) * 2.2 + 1.2;
        z = radius * Math.sin(theta);
        colorSample = violet;
      } else {
        // Shoulders & Chest Bust
        const theta = Math.random() * Math.PI * 2;
        const radiusX = 5.5 + Math.random() * 0.8;
        const radiusZ = 2.5 + Math.random() * 0.5;
        x = radiusX * Math.cos(theta);
        y = (Math.random() - 0.5) * 3.0 - 1.5;
        z = radiusZ * Math.sin(theta);
        colorSample = cyan;
      }

      // Store target head positions
      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;

      // Dispersed initial position for materialization effect
      const scatter = 20.0;
      pos[i * 3] = x + (Math.random() - 0.5) * scatter;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * scatter;
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * scatter;

      col[i * 3] = colorSample.r;
      col[i * 3 + 1] = colorSample.g;
      col[i * 3 + 2] = colorSample.b;

      sz[i] = Math.random() * 0.8 + 0.4;
    }

    return {
      positions: pos,
      originalPositions: origPos,
      colors: col,
      sizes: sz,
    };
  }, []);

  useFrame((state, delta) => {
    // Scene 4 & 5: Mouse lookAt lerping & smiling float motion
    if (groupRef.current) {
      const targetRotationY = pointer.x * 0.45;
      const targetRotationX = -pointer.y * 0.3;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
    }

    // Materialization transition effect (particles coalescing)
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const t = Math.min(Math.max(progress, 0), 1);

      for (let i = 0; i < positions.length / 3; i++) {
        const targetX = originalPositions[i * 3];
        const targetY = originalPositions[i * 3 + 1];
        const targetZ = originalPositions[i * 3 + 2];

        // Lerp particle positions toward true avatar form
        array[i * 3] = THREE.MathUtils.lerp(array[i * 3], targetX, delta * 4 * t);
        array[i * 3 + 1] = THREE.MathUtils.lerp(array[i * 3 + 1], targetY, delta * 4 * t);
        array[i * 3 + 2] = THREE.MathUtils.lerp(array[i * 3 + 2], targetZ, delta * 4 * t);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.85 * progress}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core Glowing Hologram Ambient Energy Light */}
      <pointLight position={[0, 4.5, 2]} color="#00f0ff" intensity={3 * progress} distance={10} />
      <pointLight position={[0, 4.5, -2]} color="#f472b6" intensity={2 * progress} distance={8} />
    </group>
  );
}
