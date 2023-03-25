import { Vector3 } from "../modules/vector3";

export class Light {
  color: Vector3.T;
  position: Vector3.T;

  constructor(color: Vector3.T, position: Vector3.T) {
    this.color = color;
    this.position = position;
  }
}
