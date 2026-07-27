"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const target = new THREE.Vector3();

export default function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame((state, delta) => {
    camera.position.z -= delta * 1.5;

    target.set(mouse.x * 2, mouse.y * 1, camera.position.z);

    camera.position.lerp(target, 0.03);

    camera.lookAt(0, 0, camera.position.z - 10);
  });

  return null;
}