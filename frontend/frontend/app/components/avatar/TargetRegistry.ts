"use client";

import * as THREE from "three";

/**
 * Every UI element Luna can interact with.
 */

export type TargetID =
  | "heroTitle"
  | "heroSubtitle"
  | "startButton"
  | "demoButton"
  | "featureCards"
  | "pipeline"
  | "chatbot"
  | "register"
  | "navbar";

/**
 * Internal registry.
 */

class Registry {

  /**
   * HTML elements.
   */

  private elements = new Map<TargetID, HTMLElement>();

  //---------------------------------------------

  register(id: TargetID, element: HTMLElement) {

    this.elements.set(id, element);

  }

  //---------------------------------------------

  unregister(id: TargetID) {

    this.elements.delete(id);

  }

  //---------------------------------------------

  has(id: TargetID) {

    return this.elements.has(id);

  }

  //---------------------------------------------

  getElement(id: TargetID) {

    return this.elements.get(id);

  }

  //---------------------------------------------

  /**
   * Returns screen center.
   */

  getScreenPosition(id: TargetID) {

    const el = this.elements.get(id);

    if (!el) return null;

    const rect = el.getBoundingClientRect();

    return {

      x: rect.left + rect.width / 2,

      y: rect.top + rect.height / 2,

      width: rect.width,

      height: rect.height

    };

  }

  //---------------------------------------------

  /**
   * Converts HTML position
   * to normalized device coordinates.
   */

  getNDC(id: TargetID) {

    const pos = this.getScreenPosition(id);

    if (!pos) return null;

    return new THREE.Vector2(

      (pos.x / window.innerWidth) * 2 - 1,

      -(pos.y / window.innerHeight) * 2 + 1

    );

  }

  //---------------------------------------------

  /**
   * Converts HTML position
   * into world space.
   *
   * CameraController and LookAtController
   * will use this.
   */

  getWorldPosition(

    id: TargetID,

    camera: THREE.Camera,

    distance = 2

  ) {

    const ndc = this.getNDC(id);

    if (!ndc) return null;

    const point = new THREE.Vector3(

      ndc.x,

      ndc.y,

      0.5

    );

    point.unproject(camera);

    const dir = point.sub(camera.position).normalize();

    return camera.position.clone().add(

      dir.multiplyScalar(distance)

    );

  }

}

/**
 * Global singleton.
 */

export const TargetRegistry = new Registry();