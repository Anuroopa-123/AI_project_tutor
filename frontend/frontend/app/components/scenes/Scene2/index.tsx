"use client";

import HolographicRing from "./HolographicRing";
import HolographicAvatar from "./HolographicAvatar";

interface Scene2Props {
  progress?: number;
}

export default function Scene2({ progress = 1.0 }: Scene2Props) {
  return (
    <group position={[0, 0, 0]}>
      {/* Scene 2: Holographic Portal Ring */}
      <HolographicRing progress={progress} position={[0, 0.5, 0]} />

      {/* Scene 3, 4, 5: AI Avatar Materialization & Cursor Tracking */}
      <HolographicAvatar progress={progress} position={[0, -3.5, 2]} />
    </group>
  );
}
