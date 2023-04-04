import { Vector3 } from "../modules/vector3";

import { ScreenRatio } from "../interfaces/screen-ratio";
import { Ray } from "./ray";

export class Camera {
  position: Vector3.T;
  ratio: number;
  screen: ScreenRatio;

  constructor(position: Vector3.T, width: number, height: number) {
    this.position = position;
    this.ratio = width / height;
    this.screen = {
      left: -1,
      top: 1 / this.ratio,
      right: 1,
      bottom: -1 / this.ratio,
    };
  }

  generateRay(pixel: Vector3.T): Ray {
    return new Ray(
      this.position,
      Vector3.normalize(Vector3.subtract(pixel, this.position))
    );
  }
}
