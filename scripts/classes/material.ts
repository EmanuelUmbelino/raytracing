import { o } from "../modules/o";

import { Hit } from "./hit";
import { Scene } from "./scene";

export class Material {
  ambient: o.Vector3;
  diffuse: o.Vector3;
  specular: o.Vector3;

  shininess: number;
  reflection: number;

  constructor(d: {
    ambient: o.Vector3;
    diffuse: o.Vector3;
    specular: o.Vector3;

    shininess: number;
    reflection: number;
  }) {
    this.ambient = d.ambient;
    this.diffuse = d.diffuse;
    this.specular = d.specular;

    this.shininess = d.shininess;
    this.reflection = d.reflection;
  }

  eval(scene: Scene, hit: Hit, origin: o.Vector3): o.Vector3 {
    let color = o.multiply(this.ambient, scene.ambientLight);

    const viewDirection = o.normalize(o.subtract(origin, hit.pos));
    scene.lightSources.forEach((lightSource) => {
      const [lightColor, intersectioToLight] = lightSource.light.radiance(
        scene,
        lightSource.shape.position,
        hit.shiftedPoint
      );
      const diffuse = o.scale(
        o.multiply(this.diffuse, lightColor),
        o.dot(intersectioToLight, hit.normal)
      );

      const reflectionDirection = o.normalize(
        o.add(intersectioToLight, viewDirection)
      );
      const specular = o.scale(
        o.multiply(this.specular, lightColor),
        Math.pow(
          Math.max(0, o.dot(hit.normal, reflectionDirection)),
          this.shininess
        )
      );
      color = o.add(color, diffuse, specular);
    });

    return color;
  }
}
