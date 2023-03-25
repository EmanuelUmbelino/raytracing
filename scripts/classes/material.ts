import { Vector3 } from "../modules/vector3";

export class Material {
  ambient: Vector3.T;
  diffuse: Vector3.T;
  specular: Vector3.T;

  shininess: number;
  reflection: number;

  constructor(
    ambient: Vector3.T,
    diffuse: Vector3.T,
    specular: Vector3.T,

    shininess: number,
    reflection: number
  ) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;

    this.shininess = shininess;
    this.reflection = reflection;
  }
}
