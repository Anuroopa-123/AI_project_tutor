"use client";

import Environment from "./Environment";
import CameraController from "./CameraController";
import RenderPipeline from "./RenderPipeline";

export default function SceneController() {
  return (
    <>
      <Environment />

      <CameraController />

      {/* Scene objects will be mounted here */}

      <RenderPipeline />
    </>
  );
}