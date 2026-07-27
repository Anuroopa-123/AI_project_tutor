"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const target = new THREE.Vector3();

export default function CameraController() {
  const { camera, mouse } = useThree();

  useFrame((_, delta) => {
    camera.position.z -= delta * 0.8;

    target.set(
      mouse.x * 1.5,
      mouse.y * 0.8,
      camera.position.z
    );

    camera.position.lerp(target, 0.03);

    camera.lookAt(0, 0, camera.position.z - 15);
  });

  return null;
}