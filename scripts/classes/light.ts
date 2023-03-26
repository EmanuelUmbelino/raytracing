import { o } from "../modules/o";

import { Hit } from "./hit";
import { Ray } from "./ray";
import { Scene } from "./scene";

export class Light {
  color: o.Vector3;
  power: number;

  constructor(color: o.Vector3, power: number) {
    this.color = color;
    this.power = power;
  }

  radiance(
    scene: Scene,
    pos: o.Vector3,
    point: o.Vector3
  ): [o.Vector3, o.Vector3] {
    const lightDirection = o.normalize(o.subtract(pos, point));

    const ray = new Ray(point, lightDirection);

    const hit: Hit | null = scene.computeIntersection(ray);
    if (hit) {
      if (hit.instance.light === this) {
        const lightColor = o.scaleDivide(
          o.scale(this.color, this.power),
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
