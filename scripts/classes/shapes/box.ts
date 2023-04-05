import { Vector3 } from "../../modules/vector3";

import { Shape } from "./shape";
import { Ray } from "../ray";

export class Box extends Shape {
  pMin: Vector3.T;
  pMax: Vector3.T;

  constructor(pMin: Vector3.T, pMax: Vector3.T) {
    super();

    this.pMin = pMin;
    this.pMax = pMax;
  }

  normalIntersect(intersection: Vector3.T): Vector3.T {
    const epsilon = 0.0001;

    if (Math.abs(intersection[0] - this.pMin[0]) < epsilon) {
      return [-1, 0, 0];
    } else if (Math.abs(intersection[0] - this.pMax[0]) < epsilon) {
      return [1, 0, 0];
    } else if (Math.abs(intersection[1] - this.pMin[1]) < epsilon) {
      return [0, -1, 0];
    } else if (Math.abs(intersection[1] - this.pMax[1]) < epsilon) {
      return [0, 1, 0];
    } else if (Math.abs(intersection[2] - this.pMin[2]) < epsilon) {
      return [0, 0, -1];
    } else if (Math.abs(intersection[2] - this.pMax[2]) < epsilon) {
      return [0, 0, 1];
    }
    return [0, 0, 0];
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
