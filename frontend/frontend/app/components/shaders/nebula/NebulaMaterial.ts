"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, ThreeElement } from "@react-three/fiber";

/**
 * GLSL Procedural FBM Noise Volumetric Nebula Shader.
 * Generates dynamic cosmic gas cloud turbulence with soft glowing colors.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  uniform vec3 uColorOuter;
  uniform float uDensity;
  uniform float uSpeed;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // 3D Simplex noise functions
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractional Brownian Motion (fbm) with 5 octaves
  float fbm(vec3 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * snoise(p * freq);
      freq *= 2.05;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    // 2D distance falloff from disk center
    float dist = length(vUv - vec2(0.5));
    float alphaMask = smoothstep(0.5, 0.1, dist);

    // Time modulated position
    vec3 p = vPosition * 0.015;
    float timeOffset = uTime * uSpeed;

    // Primary turbulent cloud noise
    float n1 = fbm(p + vec3(timeOffset * 0.1, timeOffset * 0.15, timeOffset * 0.05));
    // Secondary detail turbulence
    float n2 = fbm(p * 2.0 - vec3(timeOffset * 0.2, timeOffset * 0.1, 0.0));

    float combinedNoise = (n1 + n2 * 0.5) * 0.5 + 0.5;

    // Color gradient mixing: Core -> Mid -> Outer
    vec3 cloudColor = mix(uColorOuter, uColorMid, smoothstep(0.2, 0.6, combinedNoise));
    cloudColor = mix(cloudColor, uColorCore, smoothstep(0.6, 0.9, combinedNoise));

    // Density and alpha thresholding
    float opacity = pow(combinedNoise, 2.5) * uDensity * alphaMask;

    gl_FragColor = vec4(cloudColor * 1.5, opacity);
  }
`;

export const NebulaShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorCore: new THREE.Color("#e0aaff"),
    uColorMid: new THREE.Color("#7b2cbf"),
    uColorOuter: new THREE.Color("#10002b"),
    uDensity: 0.6,
    uSpeed: 0.08,
  },
  vertexShader,
  fragmentShader
);

extend({ NebulaShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    nebulaShaderMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      uTime?: number;
      uColorCore?: THREE.Color;
      uColorMid?: THREE.Color;
      uColorOuter?: THREE.Color;
      uDensity?: number;
      uSpeed?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      side?: THREE.Side;
    };
  }
}
