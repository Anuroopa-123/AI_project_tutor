"use client";

import * as THREE from "three";
import {
  WaypointID,
  getWaypoint,
} from "./WaypointSystem";

/**
 * MotionDirector
 * ------------------------------------
 * Responsible ONLY for movement.
 *
 * It does NOT:
 *
 * ❌ Wave
 * ❌ Talk
 * ❌ Blink
 * ❌ Point
 *
 * It ONLY walks Luna around the stage.
 */

export class MotionDirector {

  private position = new THREE.Vector3();

  private rotationY = 0;

  private velocity = 0;

  private currentWaypoint: WaypointID = "entry";

  private targetWaypoint: WaypointID = "entry";

  private walking = false;

  //--------------------------------

  private maxSpeed = 1.2;

  private acceleration = 3;

  private deceleration = 5;

  private rotateSpeed = 5;

  //--------------------------------

  constructor() {

    const start = getWaypoint("entry");

    this.position.copy(start.position);

    this.rotationY = start.rotationY;

  }

  //--------------------------------

  public walkTo(id: WaypointID) {

    this.targetWaypoint = id;

    this.walking = true;

  }

  //--------------------------------

  public stop() {

    this.walking = false;

    this.velocity = 0;

  }

  //--------------------------------

  public isWalking() {

    return this.walking;

  }

  //--------------------------------

  public getPosition() {

    return this.position;

  }

  //--------------------------------

  public getRotationY() {

    return this.rotationY;

  }

  //--------------------------------

  public getCurrentWaypoint() {

    return this.currentWaypoint;

  }

  //--------------------------------

  public update(delta: number) {

    if (!this.walking) return;

    const target = getWaypoint(this.targetWaypoint);

    //----------------------------------------------------
    // distance
    //----------------------------------------------------

    const direction = target.position.clone().sub(this.position);

    const distance = direction.length();

    //----------------------------------------------------
    // arrived
    //----------------------------------------------------

    if (distance < 0.02) {

      this.position.copy(target.position);

      this.rotationY = target.rotationY;

      this.velocity = 0;

      this.walking = false;

      this.currentWaypoint = this.targetWaypoint;

      return;

    }

    //----------------------------------------------------
    // desired speed
    //----------------------------------------------------

    let desiredSpeed = this.maxSpeed;

    if (distance < 0.5) {

      desiredSpeed *= distance * 2;

    }

    //----------------------------------------------------
    // smooth acceleration
    //----------------------------------------------------

    if (this.velocity < desiredSpeed) {

      this.velocity += this.acceleration * delta;

    } else {

      this.velocity -= this.deceleration * delta;

    }

    this.velocity = THREE.MathUtils.clamp(
      this.velocity,
      0,
      this.maxSpeed
    );

    //----------------------------------------------------
    // movement
    //----------------------------------------------------

    direction.normalize();

    this.position.addScaledVector(

      direction,

      this.velocity * delta

    );

    //----------------------------------------------------
    // body rotation
    //----------------------------------------------------

    const targetAngle = Math.atan2(

      direction.x,

      direction.z

    );

    this.rotationY = THREE.MathUtils.lerp(

      this.rotationY,

      targetAngle,

      delta * this.rotateSpeed

    );

  }

}