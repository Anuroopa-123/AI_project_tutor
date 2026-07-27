import Universe from "./Universe";
import AmbientLight from "./AmbientLight";
import CameraRig from "./CameraRig";
import Stars from "./Stars";
import Nebula from "./Nebula";
import PostProcessing from "./PostProcessing";

export default function Scene() {
  return (
    <>
      <Universe />

      <AmbientLight />

      <CameraRig />

      <Nebula />

      <Stars />
      <PostProcessing />
    </>
  );
}