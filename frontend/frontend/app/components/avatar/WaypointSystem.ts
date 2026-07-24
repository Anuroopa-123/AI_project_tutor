"use client";

import * as THREE from "three";

/**
 * Every place Luna can stand during the presentation.
 *
 * Think of these as invisible markers placed on the floor.
 *
 * MotionDirector walks Luna between these points.
 */

export type WaypointID =
  | "entry"
  | "center"
  | "hero"
  | "startButton"
  | "features"
  | "chatbot"
  | "register"
  | "exit";

/**
 * A waypoint describes
 *
 * - where Luna stands
 * - which direction she faces
 * - camera framing
 * - how long to pause there
 */

export interface Waypoint {

  id: WaypointID;

  name: string;

  position: THREE.Vector3;

  rotationY: number;

  cameraTarget: THREE.Vector3;

  pause: number;
}

/**
 * Invisible presentation locations.
 *
 * X = left/right
 * Y = floor
 * Z = forward/back
 */

export const WAYPOINTS: Record<WaypointID, Waypoint> = {

  entry: {

    id: "entry",

    name: "Entry",

    position: new THREE.Vector3(3.2, -1.0, 0),

    rotationY: -0.45,

    cameraTarget: new THREE.Vector3(0, -0.2, 0),

    pause: 0

  },

  center: {

    id: "center",

    name: "Center",

    position: new THREE.Vector3(0, -1.0, 0),

    rotationY: 0,

    cameraTarget: new THREE.Vector3(0, -0.2, 0),

    pause: 1

  },

  hero: {

    id: "hero",

    name: "Hero Heading",

    position: new THREE.Vector3(0.75, -1.0, 0),

    rotationY: 0.18,

    cameraTarget: new THREE.Vector3(-0.9, 0.2, 0),

    pause: 2

  },

  startButton: {

    id: "startButton",

    name: "Start Button",

    position: new THREE.Vector3(1.35, -1.0, 0),

    rotationY: 0.35,

    cameraTarget: new THREE.Vector3(-1.1, -0.35, 0),

    pause: 2

  },

  features: {

    id: "features",

    name: "Features",

    position: new THREE.Vector3(-1.2, -1.0, 0),

    rotationY: -0.35,

    cameraTarget: new THREE.Vector3(0.8, 0, 0),

    pause: 2

  },

  chatbot: {

    id: "chatbot",

    name: "Chatbot",

    position: new THREE.Vector3(-1.8, -1.0, 0),

    rotationY: -0.55,

    cameraTarget: new THREE.Vector3(-1.9, -0.6, 0),

    pause: 2

  },

  register: {

    id: "register",

    name: "Register",

    position: new THREE.Vector3(1.6, -1.0, 0),

    rotationY: 0.42,

    cameraTarget: new THREE.Vector3(1.5, -0.4, 0),

    pause: 2

  },

  exit: {

    id: "exit",

    name: "Exit",

    position: new THREE.Vector3(3.5, -1.0, 0),

    rotationY: 0.6,

    cameraTarget: new THREE.Vector3(0, -0.2, 0),

    pause: 0

  }

};

/**
 * Returns a waypoint.
 */

export function getWaypoint(id: WaypointID): Waypoint {

  return WAYPOINTS[id];

}

/**
 * Returns waypoint position.
 */

export function getWaypointPosition(id: WaypointID): THREE.Vector3 {

  return WAYPOINTS[id].position.clone();

}

/**
 * Returns facing angle.
 */

export function getWaypointRotation(id: WaypointID): number {

  return WAYPOINTS[id].rotationY;

}

/**
 * Returns camera target.
 */

export function getCameraTarget(id: WaypointID): THREE.Vector3 {

  return WAYPOINTS[id].cameraTarget.clone();

}

/**
 * Useful for debugging.
 */

export function getAllWaypoints(): Waypoint[] {

  return Object.values(WAYPOINTS);

}