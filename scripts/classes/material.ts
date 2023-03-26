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

    const viewDirection = Vector3.normalize(Vector3.subtract(origin, hit.pos));
    scene.lightSources.forEach((lightSource) => {
      const [lightColor, intersectioToLight] = lightSource.light.radiance(
        scene,
        lightSource.shape.position,
        hit.shiftedPoint
      );
      const diffuse = Vector3.scale(
        Vector3.multiply(this.diffuse, lightColor),
        Vector3.dot(intersectioToLight, hit.normal)
      );

      const reflectionDirection = Vector3.normalize(
        Vector3.add(intersectioToLight, viewDirection)
      );
      const specular = Vector3.scale(
        Vector3.multiply(this.specular, lightColor),
        Math.pow(
          Math.max(0, Vector3.dot(hit.normal, reflectionDirection)),
          this.shininess
        )
      );
      color = Vector3.add(color, diffuse, specular);
    });

    return color;
  }
}
