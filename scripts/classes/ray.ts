import { Shape } from "./shapes/shape";
import { o } from "../modules/o";
import { Instance } from "./instance";

export class Ray {
  origin: o.Vector3;
  direction: o.Vector3;

  constructor(origin: o.Vector3, direction: o.Vector3) {
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
}
