import { o } from "../../modules/o";

import { Shape } from "./shape";
import { Ray } from "../ray";

export class Sphere implements Shape {
  position: o.Vector3;
  radius: number;

  constructor(position: o.Vector3, radius: number) {
    this.position = position;
    this.radius = radius;
  }

  intersect(ray: Ray): number[] | null {
    const oc: o.Vector3 = o.subtract(ray.origin, this.position);

    const a: number = o.squared(ray.direction);
    const b: number = 2 * o.dot(ray.direction, oc);
    const c: number = o.squared(oc) - this.radius * this.radius;

    const delta: number = b * b - 4 * a * c;

    if (delta > 0) {
      const t1: number = (-b + Math.sqrt(delta)) / (2 * a);
      const t2: number = (-b - Math.sqrt(delta)) / (2 * a);

      return [t1, t2];
    }
    return null;
  }
}
