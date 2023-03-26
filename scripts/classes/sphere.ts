import { Vector3 } from "../modules/vector3";

import { Shape } from "./shape";
import { Ray } from "./ray";

export class Sphere implements Shape {
  position: Vector3.T;
  radius: number;

  constructor(position: Vector3.T, radius: number) {
    this.position = position;
    this.radius = radius;
  }

  intersect(ray: Ray): number[] | null {
    const oc: Vector3.T = Vector3.subtract(ray.origin, this.position);

    const a: number = Vector3.squared(ray.direction);
    const b: number = 2 * Vector3.dot(ray.direction, oc);
    const c: number = Vector3.squared(oc) - this.radius * this.radius;

    const delta: number = b * b - 4 * a * c;

    if (delta > 0) {
      const t1: number = (-b + Math.sqrt(delta)) / (2 * a);
      const t2: number = (-b - Math.sqrt(delta)) / (2 * a);

      return [t1, t2];
    }
    return null;
  }
}
