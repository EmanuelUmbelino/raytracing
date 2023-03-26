import { Shape } from "./shape";
import { Vector3 } from "../modules/vector3";
import { Instance } from "./instance";

export class Ray {
  origin: Vector3.T;
  direction: Vector3.T;

  constructor(origin: Vector3.T, direction: Vector3.T) {
    this.origin = origin;
    this.direction = direction;
  }

  static nearestIntersectedObject(ray: Ray, objs: Instance[]) {
    const distances: (number | null)[] = [];
    objs.forEach((obj) => {
      let intersect = obj.shape.intersect(ray);
      let d: any =
        intersect !== null && intersect[0] > 0 && intersect[1] > 0
          ? Math.min(...intersect)
          : null;
      distances.push(d);
    });

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

  static reflect(ray: Ray, normalToSurface: Vector3.T): Vector3.T {
    return Vector3.subtract(
      ray.direction,
      Vector3.scale(
        normalToSurface,
        2 * Vector3.dot(ray.direction, normalToSurface)
      )
    );
  }
}
