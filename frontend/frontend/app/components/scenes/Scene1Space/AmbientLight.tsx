"use client";

export default function AmbientLight() {
  return (
    <>
      <ambientLight intensity={0.35} />

      <pointLight
        position={[10, 10, 10]}
        intensity={15}
        color="#4fc3f7"
      />

      <pointLight
        position={[-10, -5, -10]}
        intensity={10}
        color="#7c4dff"
      />
    </>
  );
}