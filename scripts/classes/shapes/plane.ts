import { Vector3 } from "../../modules/vector3";

import { Shape } from "./shape";
import { Ray } from "../ray";

export class Plane extends Shape {
  position: Vector3.T;
  normal: Vector3.T;

  constructor(position: Vector3.T, normal: Vector3.T) {
    super();

    this.position = position;
    this.normal = normal;
  }

  normalIntersect(intersection: Vector3.T): Vector3.T {
    return this.normal;
  }

  _intersect(ray: Ray): number[] | null {
    const d: number = Vector3.dot(this.normal, ray.direction);
    if (Math.abs(d) < Number.EPSILON) return null;

    const distance =
      Vector3.dot(Vector3.subtract(this.position, ray.origin), this.normal) / d;
    if (distance < 0) return null;

    return [distance];
  }
}
