import { Shape } from "./shapes/shape";
import { Instance } from "./instance";
import { Vector3 } from "../modules/vector3";

export class Ray {
  origin: Vector3.T;
  direction: Vector3.T;

  constructor(origin: Vector3.T, direction: Vector3.T) {
    this.origin = origin;
    this.direction = direction;
  }
}
