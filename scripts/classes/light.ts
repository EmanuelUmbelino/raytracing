import { SimpleMaterial } from "../interfaces/material";
import { Vector3 } from "./vector3";

export class Light {
  material: SimpleMaterial;
  position: Vector3;

  constructor(material: SimpleMaterial, position: Vector3) {
    this.material = material;
    this.position = position;
  }
}
