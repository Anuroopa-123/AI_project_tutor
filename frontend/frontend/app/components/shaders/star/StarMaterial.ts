"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, ThreeElement } from "@react-three/fiber";

/**
 * GLSL Vertex Shader for GPU-accelerated twinkling starfield.
 * Uses safe view-space distance attenuation.
 */
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

    // Twinkling animation (0.4 to 1.0)
    vTwinkle = sin(uTime * aTwinkleSpeed + aPhase) * 0.35 + 0.65;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Distance-based size attenuation with safety bounds
    float viewDist = max(0.1, -mvPosition.z);
    gl_PointSize = max(1.0, (aSize * uBaseSize * uPixelRatio * vTwinkle) / viewDist);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

/**
 * GLSL Fragment Shader for round glowing stars.
 */
const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.18, dist);
    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.8);

    gl_FragColor = vec4(finalColor, alpha * vTwinkle);
  }
`;

export const StarShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uPixelRatio: 1,
    uBaseSize: 35,
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
