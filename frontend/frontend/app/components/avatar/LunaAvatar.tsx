"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";
import { AnimationController } from "./AnimationController";
import { SpeechController } from "./SpeechController";

interface LunaAvatarProps {
  animController: AnimationController;
  modelUrl?: string;
  onStatusChange?: (status: LoadStatus) => void;
  /** Shows a red bounding-box + axes gizmo. Debug only. */
  debug?: boolean;
}

export type LoadStatus =
  | { state: "loading"; message: string }
  | { state: "ready" }
  | { state: "error"; message: string };

/**
 * Normalizes an arbitrary-scale model to a consistent ~1.6m standing height,
 * centered horizontally and feet planted at y = groundY.
 */
function normalizeAndCenter(object: THREE.Object3D, groundY: number, targetHeight = 1.6) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  if (size.y <= 0 || !isFinite(size.y)) {
    console.warn("[LunaAvatar] Model bounding box has zero/invalid height — model may be empty or malformed.");
    return;
  }

  const scaleFactor = targetHeight / size.y;
  object.scale.multiplyScalar(scaleFactor);

  const scaledBox = new THREE.Box3().setFromObject(object);
  const scaledCenter = new THREE.Vector3();
  scaledBox.getCenter(scaledCenter);

  object.position.x -= scaledCenter.x;
  object.position.z -= scaledCenter.z;
  object.position.y -= scaledBox.min.y - groundY;
}

export default function LunaAvatar({
  animController,
  modelUrl = "/avatar/AvatarSample_A.vrm",
  onStatusChange,
  debug = false,
}: LunaAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthLevel, setMouthLevel] = useState(0);

  useEffect(() => {
    const speech = SpeechController.getInstance();
    const unsubscribe = speech.subscribe((speaking, mouthVal) => {
      setIsSpeaking(speaking);
      setMouthLevel(mouthVal);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    const report = (status: LoadStatus) => {
      if (isMounted && onStatusChange) onStatusChange(status);
    };

    report({ state: "loading", message: `Fetching ${modelUrl}…` });

    loader.load(
      encodeURI(modelUrl),
      (gltf) => {
        if (!isMounted) return;
        const loadedVrm = gltf.userData.vrm as VRM | undefined;
        if (!loadedVrm) {
          report({
            state: "error",
            message: "File loaded but contains no VRM data — check it's a valid .vrm export.",
          });
          return;
        }

        loadedVrm.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        normalizeAndCenter(loadedVrm.scene, 0, 1.6); // groundY handled by group position instead

        if (debug) {
          loadedVrm.scene.add(new THREE.BoxHelper(loadedVrm.scene, 0xff0000));
          loadedVrm.scene.add(new THREE.AxesHelper(1));
        }

        setVrm(loadedVrm);
        report({ state: "ready" });
      },
      (progress) => {
        if (progress.total) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          report({ state: "loading", message: `Loading model… ${pct}%` });
        }
      },
      (err) => {
        console.error("[LunaAvatar] Failed to load VRM:", err);
        report({
          state: "error",
          message:
            err?.message || "Unknown error loading the VRM. Check the Network tab for this file's response.",
        });
      }
    );

    return () => {
      isMounted = false;
    };
  }, [modelUrl, debug]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    console.log(animController);

    const { position, rotationY } = animController.update(
      delta,
      state.clock.getElapsedTime(),
      vrm,
      mouthLevel,
      isSpeaking
    );

    groupRef.current.position.copy(position);
    groupRef.current.rotation.y = rotationY;

    if (vrm) vrm.update(delta);
  });

  return <group ref={groupRef}>{vrm && <primitive object={vrm.scene} />}</group>;
}