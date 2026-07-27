"use client";

import Universe from "./Universe";
import AmbientLight from "./AmbientLight";
import CameraRig from "./CameraRig";
import Stars from "./Stars";
import Nebula from "./Nebula";
import SpaceDust from "./SpaceDust";
import Planet from "../../planets/Planet";
import PostProcessing from "./PostProcessing";

export default function Scene() {
  return (
    <>
      <Universe />
      <AmbientLight />
      <CameraRig />
      <Nebula />
      <Planet position={[0, -2, -30]} scale={1.1} />
      <Stars />
      <SpaceDust />
      <PostProcessing />
    </>
  );
}