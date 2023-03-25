import { ScreenRatio } from "../interfaces/screen-ratio";
import { Vector3 } from "./vector3";

export class Camera {
  position: Vector3;
  ratio: number;
  screen: ScreenRatio;

  constructor(position: Vector3, width: number, height: number) {
    this.position = position;
    this.ratio = width / height;
    this.screen = {
      left: -1,
      top: 1 / this.ratio,
      right: 1,
      bottom: -1 / this.ratio,
    };
  }
}
