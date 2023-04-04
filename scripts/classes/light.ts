import { Vector3 } from "../modules/vector3";

import { Hit } from "./hit";
import { Ray } from "./ray";
import { Scene } from "./scene";

export class Light {
  color: Vector3.T;
  power: number;

  constructor(color: Vector3.T, power: number) {
    this.color = color;
    this.power = power;
  }

  radiance(
    scene: Scene,
    pos: Vector3.T,
    point: Vector3.T
  ): [Vector3.T, Vector3.T] {
    const lightDirection = Vector3.normalize(Vector3.subtract(pos, point));

    const ray = new Ray(point, lightDirection);

    const hit: Hit | null = scene.computeIntersection(ray);
    if (hit) {
      if (hit.instance.light === this) {
        const lightColor = Vector3.scaleDivide(
          Vector3.scale(this.color, this.power),
          Math.pow(hit.distance, 2)
        );
        return [lightColor, lightDirection];
      }
    }
    return [
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
}
