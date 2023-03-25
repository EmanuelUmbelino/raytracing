import { Vector3 } from "../modules/vector3";

export interface Material {
  ambient: Vector3.T;
  diffuse: Vector3.T;
  specular: Vector3.T;

  shininess: number;
  reflection: number;
}
