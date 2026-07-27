"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, ThreeElement } from "@react-three/fiber";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;

  attribute float aSize;
  attribute vec3 aColor;
  attribute float aTwinkleSpeed;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;
    vTwinkle = sin(uTime * aTwinkleSpeed + aPhase) * 0.35 + 0.65;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (aSize * uBaseSize * uPixelRatio * vTwinkle) / (-mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.7);

    gl_FragColor = vec4(finalColor, alpha * vTwinkle);
  }
`;

export const StarShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uPixelRatio: 1,
    uBaseSize: 30,
  },
  vertexShader,
  fragmentShader
);

extend({ StarShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    starShaderMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      uTime?: number;
      uPixelRatio?: number;
      uBaseSize?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
    };
  }
}