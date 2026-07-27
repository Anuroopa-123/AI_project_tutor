"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

const _targetPos = new THREE.Vector3();

export default function CameraRig() {
  const { camera, pointer } = useThree();
  const arrived = useRef(false);

  useFrame((_, delta) => {
    // Fly forward from Z=100 toward Z=55, then hold steady
    if (!arrived.current && camera.position.z > 55) {
      camera.position.z -= delta * 5;
      if (camera.position.z <= 55) {
        camera.position.z = 55;
        arrived.current = true;
      }
    }

    // Subtle mouse parallax on X/Y
    const mx = pointer.x * 4;
    const my = pointer.y * 2;
    _targetPos.set(mx, my, camera.position.z);
    camera.position.lerp(_targetPos, 0.04);

    // Always look forward
    camera.lookAt(0, 0, 0);
  });

  return null;
}