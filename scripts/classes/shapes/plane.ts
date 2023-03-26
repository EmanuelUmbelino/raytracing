import { o } from "../../modules/o";

import { Shape } from "./shape";
import { Ray } from "../ray";

export class Plane implements Shape {
  position: o.Vector3;
  normal: o.Vector3;

  constructor(position: o.Vector3, normal: o.Vector3) {
    this.position = position;
    this.normal = normal;
  }

  intersect(ray: Ray): number[] | null {
    const d: number = o.dot(this.normal, ray.direction);
    if (Math.abs(d) < Number.EPSILON) return null;

    const distance =
      o.dot(o.subtract(this.position, ray.origin), this.normal) / d;
    if (distance < 0) return null;

    return [distance];
  }
}
