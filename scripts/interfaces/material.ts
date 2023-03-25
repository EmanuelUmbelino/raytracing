import { Vector3 } from "../classes/vector3";

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export interface SimpleMaterial {
  ambient: Vector3;
  diffuse: Vector3;
  specular: Vector3;
}

export interface Material extends SimpleMaterial {
  shininess: number;
  reflection: number;
}
