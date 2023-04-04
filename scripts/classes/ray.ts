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

  static nearestIntersectedObject(ray: Ray, objs: Instance[]) {
    const distances: (number | null)[] = objs.map((instance) =>
      instance.shape.intersect(ray)
    );

    let nearest: Instance | null = null;
    let min: number = Number.POSITIVE_INFINITY;
    for (
      let i = 0, d = distances[i];
      i < distances.length;
      i++, d = distances[i]
    ) {
      if (d !== null && d < min) {
        min = d;
        nearest = objs[i];
      }
    }
    return { nearest, min };
  }
}
