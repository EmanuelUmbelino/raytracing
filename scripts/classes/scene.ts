import { o } from "../modules/o";
import { Hit } from "./hit";

import { Instance } from "./instance";
import { Light } from "./light";
import { Material } from "./material";
import { Ray } from "./ray";
import { Plane } from "./shapes/plane";

import { Sphere } from "./shapes/sphere";

export class Scene {
  maxDepth: number;
  ambientLight: o.Vector3;

  instances: Instance[] = [];

  get lightSources(): Instance[] {
    return this.instances.filter((el) => el.light !== undefined);
  }

  constructor(maxDepth: number = 3) {
    this.maxDepth = maxDepth;

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
      new Instance(new Plane([0, -0.7, 0], [0, 1, 0]), mirrorMaterial)
    );
  }

  computeIntersection(ray: Ray): Hit | null {
    const distances: (number | null)[] = [];
    this.instances.forEach((instance) => {
      let intersect = instance.shape.intersect(ray);
      let d: any =
        intersect !== null &&
        intersect.filter((el) => el > 0).length === intersect.length
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
      const intersection = o.add(ray.origin, o.scale(ray.direction, min));
      let normalToSurface = o.normalize(
        o.subtract(intersection, instance.shape.position)
      );
      if (instance.shape instanceof Plane) {
        normalToSurface = instance.shape.normal;
      }
      return new Hit(intersection, normalToSurface, false, instance, min);
    }
    return null;
  }

  traceRay(ray: Ray) {
    let color: o.Vector3 = [0, 0, 0];
    let reflection = 1;

    for (let k = 0; k < this.maxDepth; k++) {
      const hit: Hit | null = this.computeIntersection(ray);
      if (hit) {
        if (hit.instance.light) {
          color = o.add(
            this.ambientLight,
            o.scaleDivide(
              o.scale(hit.instance.light.color, hit.instance.light.power),
              Math.pow(hit.distance, 2)
            )
          );
        } else {
          const illumination: o.Vector3 = hit.instance.material.eval(
            this,
            hit,
            ray.origin
          );
          color = o.add(color, o.scale(illumination, reflection));
          reflection *= hit.instance.material.reflection;
        }
        ray = new Ray(hit.shiftedPoint, o.reflect(ray.direction, hit.normal));
      } else {
        break;
      }
    }

    return o.scale(o.clip(color, 0, 1), 255);
  }
}
