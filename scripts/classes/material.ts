import { Vector3 } from "../modules/vector3";

import { Hit } from "./hit";
import { Scene } from "./scene";

export class Material {
  ambient: Vector3.T;
  diffuse: Vector3.T;
  specular: Vector3.T;

  shininess: number;
  reflection: number;

  constructor(d: {
    ambient: Vector3.T;
    diffuse: Vector3.T;
    specular: Vector3.T;

    shininess: number;
    reflection: number;
  }) {
    this.ambient = d.ambient;
    this.diffuse = d.diffuse;
    this.specular = d.specular;

    this.shininess = d.shininess;
    this.reflection = d.reflection;
  }

  eval(scene: Scene, hit: Hit, origin: Vector3.T): Vector3.T {
    let color = Vector3.multiply(this.ambient, scene.ambientLight);

    const v = Vector3.normalize(Vector3.subtract(origin, hit.pos));

    const shiftedPoint = Vector3.add(hit.pos, Vector3.scale(hit.normal, 1e-5));
    scene.lightSources.forEach((lightSource) => {
      const [lightColor, lightDirection] = lightSource.light.radiance(
        scene,
        lightSource.shape.position,
        shiftedPoint
      );
      const diffuse = Vector3.scale(
        Vector3.multiply(this.diffuse, lightColor),
        Vector3.dot(lightDirection, hit.normal)
      );

      const reflectionDirection = Vector3.reflect(lightDirection, hit.normal);
      const specular = Vector3.scale(
        this.specular,
        Math.pow(Vector3.dot(reflectionDirection, v), this.shininess / 4)
      );
      color = Vector3.add(color, diffuse, specular);
    });

    return color;
  }
}
