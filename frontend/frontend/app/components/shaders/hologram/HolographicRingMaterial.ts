"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, ThreeElement } from "@react-three/fiber";

/**
 * GLSL Holographic Ring Portal Shader.
 * Features rotating cyan/magenta energy waves, pulsing grid rings, and glowing edge rim.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uProgress;

  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec2 st = vUv - vec2(0.5);
    float dist = length(st);

    // Don't render outside circle radius 0.5 or inner cutoff 0.35
    float outerRing = smoothstep(0.5, 0.47, dist);
    float innerRing = smoothstep(0.35, 0.38, dist);
    float ringMask = outerRing * innerRing;

    if (ringMask <= 0.001) discard;

    // Angular coordinate for rotating sweep scanner
    float angle = atan(st.y, st.x);
    float sweep = sin(angle * 6.0 + uTime * 3.0) * 0.5 + 0.5;

    // Concentric glowing grid rings
    float grid = sin(dist * 120.0 - uTime * 4.0) * 0.5 + 0.5;
    grid = pow(grid, 4.0);

    // Color interpolation
    vec3 color = mix(uColor1, uColor2, sweep);
    color += vec3(grid * 0.8);

    // Pulsing transparency based on progress entrance transition
    float alpha = ringMask * (0.6 + sweep * 0.4) * uProgress;

    gl_FragColor = vec4(color * 2.0, alpha);
  }
`;

export const HolographicRingShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#00f0ff"),
    uColor2: new THREE.Color("#d946ef"),
    uProgress: 1.0,
  },
  vertexShader,
  fragmentShader
);

extend({ HolographicRingShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    holographicRingShaderMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      uTime?: number;
      uColor1?: THREE.Color;
      uColor2?: THREE.Color;
      uProgress?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      side?: THREE.Side;
    };
  }
}
