"use client";

import { useThree } from "@react-three/fiber";
import { Color, FogExp2 } from "three";
import { useEffect } from "react";

export default function Universe() {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color("#010104");

    scene.fog = new FogExp2("#010104", 0.002);
  }, [scene]);

  return null;
}