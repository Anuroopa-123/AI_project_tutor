"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={1.2}
        luminanceThreshold={0}
        radius={0.8}
      />
    </EffectComposer>
  );
}