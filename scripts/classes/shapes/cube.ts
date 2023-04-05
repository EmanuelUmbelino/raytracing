import { Vector3 } from "../../modules/vector3";

import { Shape } from "./shape";
import { Ray } from "../ray";

export class Cube extends Shape {
  pMin: Vector3.T;
  pMax: Vector3.T;

  constructor(pMin: Vector3.T, pMax: Vector3.T) {
    super();

    this.pMin = pMin;
    this.pMax = pMax;
  }

  normalIntersect(intersection: Vector3.T): Vector3.T {
    const epsilon = 0.0001;

    const center = Vector3.scale(Vector3.add(this.pMin, this.pMax), 0.5);
    const size = Vector3.subtract(this.pMax, this.pMin);
    const halfSize = Vector3.scale(size, 0.5);
    const offset = Vector3.subtract(intersection, center);

    const direction: Vector3.T = [
      Math.abs(offset[0]) - halfSize[0] < epsilon ? Math.sign(offset[0]) : 0,
      Math.abs(offset[1]) - halfSize[1] < epsilon ? Math.sign(offset[1]) : 0,
      Math.abs(offset[2]) - halfSize[2] < epsilon ? Math.sign(offset[2]) : 0,
    ];

    return Vector3.normalize(direction);
  }

  _intersect(ray: Ray): number[] | null {
    const t0: Vector3.T = Vector3.divide(
      Vector3.subtract(this.pMin, ray.origin),
      ray.direction
    );
    const t1: Vector3.T = Vector3.divide(
      Vector3.subtract(this.pMax, ray.origin),
      ray.direction
    );

    const tNear: Vector3.T = Vector3.min(t0, t1);
    const tFar: Vector3.T = Vector3.max(t0, t1);

    const tMin: number = Math.max(...tNear);
    const tMax: number = Math.min(...tFar);

    if (tMin <= tMax) {
      return [tMin, tMax];
    }
    return null;
  }
}
