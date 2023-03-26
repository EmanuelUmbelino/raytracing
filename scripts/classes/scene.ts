import { Vector3 } from "../modules/vector3";
import { Hit } from "./hit";

import { Instance } from "./instance";
import { Light } from "./light";
import { Material } from "./material";
import { Ray } from "./ray";
import { Sphere } from "./sphere";

export class Scene {
  maxDepth: number;
  ambientLight: Vector3.T;

  instances: Instance[] = [];

  get lightSources(): Instance[] {
    return this.instances.filter((el) => el.light !== undefined);
  }

  constructor() {
    this.maxDepth = 3;

    this.ambientLight = [0.9, 0.9, 0.9];

    const redMaterial: Material = new Material({
      ambient: [0.1, 0, 0],
      diffuse: [0.7, 0, 0],
      specular: [1, 1, 1],
      shininess: 100,
      reflection: 0,
    });

    const greenMaterial: Material = new Material({
      ambient: [0, 0.1, 0],
      diffuse: [0, 0.7, 0],
      specular: [1, 1, 1],
      shininess: 100,
      reflection: 0.2,
    });

    const blueMaterial: Material = new Material({
      ambient: [0, 0, 0.1],
      diffuse: [0.3, 0.3, 0.9],
      specular: [1, 1, 1],
      shininess: 100,
      reflection: 0.6,
    });

    const mirrorMaterial: Material = new Material({
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [1, 1, 1],
      shininess: 100,
      reflection: 1,
    });

    this.instances.push(
      new Instance(new Sphere([5, 5, 5], 0.1), new Light([1, 1, 1], 100))
    );

    this.instances.push(
      new Instance(new Sphere([-0.2, 0, -1], 0.7), redMaterial)
    );
    this.instances.push(
      new Instance(new Sphere([-0.3, 0, 0], 0.15), greenMaterial)
    );
    this.instances.push(
      new Instance(new Sphere([0.1, -0.3, 0], 0.1), blueMaterial)
    );
    this.instances.push(
      new Instance(new Sphere([0, -9000, 0], 9000 - 0.7), mirrorMaterial)
    );
  }

  computeIntersection(ray: Ray): Hit | null {
    const distances: (number | null)[] = [];
    this.instances.forEach((instance) => {
      let intersect = instance.shape.intersect(ray);
      let d: any =
        intersect !== null && intersect[0] > 0 && intersect[1] > 0
          ? Math.min(...intersect)
          : null;
      distances.push(d);
    });

    let instance: Instance | null = null;
    let min: number = Number.POSITIVE_INFINITY;
    for (
      let i = 0, d = distances[i];
      i < distances.length;
      i++, d = distances[i]
    ) {
      if (d !== null && d < min) {
        min = d;
        instance = this.instances[i];
      }
    }
    if (instance) {
      const intersection = Vector3.add(
        ray.origin,
        Vector3.scale(ray.direction, min)
      );
      const normalToSurface = Vector3.normalize(
        Vector3.subtract(intersection, instance.shape.position)
      );
      return new Hit(intersection, normalToSurface, false, instance, min);
    }
    return null;
  }

  traceRay(ray: Ray) {
    let color: Vector3.T = [0, 0, 0];
    let reflection = 1;

    for (let k = 0; k < this.maxDepth; k++) {
      const hit: Hit | null = this.computeIntersection(ray);
      if (hit) {
        if (hit.instance.light) {
          color = Vector3.add(
            this.ambientLight,
            Vector3.scaleDivide(
              Vector3.scale(hit.instance.light.color, hit.instance.light.power),
              Math.pow(hit.distance, 2)
            )
          );
        } else {
          const illumination: Vector3.T = hit.instance.material.eval(
            this,
            hit,
            ray.origin
          );
          color = Vector3.add(color, Vector3.scale(illumination, reflection));
          reflection *= hit.instance.material.reflection;
        }
        ray = new Ray(
          hit.shiftedPoint,
          Vector3.reflect(ray.direction, hit.normal)
        );
      } else {
        break;
      }
    }

    return Vector3.scale(Vector3.clip(color, 0, 1), 255);
  }
}
