"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function RenderPipeline() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        mipmapBlur
        luminanceThreshold={0}
        radius={0.8}
      />
    </EffectComposer>
  );
}