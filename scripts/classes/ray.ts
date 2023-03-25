import { Vector3 } from "./vector3";

export class Ray {
  origin: Vector3;
  direction: Vector3;

  constructor(origin: Vector3, direction: Vector3) {
    this.origin = origin;
    this.direction = direction;
  }

  static ray(ray: Ray, distance: number) {
    return Vector3.add(ray.origin, Vector3.scale(ray.direction, distance));
  }
}
