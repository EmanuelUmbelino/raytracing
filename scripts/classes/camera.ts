import { o } from "../modules/o";

import { ScreenRatio } from "../interfaces/screen-ratio";
import { Ray } from "./ray";

export class Camera {
  position: o.Vector3;
  ratio: number;
  screen: ScreenRatio;

  constructor(position: o.Vector3, width: number, height: number) {
    this.position = position;
    this.ratio = width / height;
    this.screen = {
      left: -1,
      top: 1 / this.ratio,
      right: 1,
      bottom: -1 / this.ratio,
    };
  }

  generateRay(pixel: o.Vector3): Ray {
    return new Ray(
      this.position,
      o.normalize(o.subtract(pixel, this.position))
    );
  }
}
