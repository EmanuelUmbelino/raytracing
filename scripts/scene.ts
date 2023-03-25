import { GPU } from "gpu.js";

import { Material } from "./interfaces/material";

import { Vector3 } from "./modules/vector3";

import { Camera } from "./classes/camera";
import { Sphere } from "./classes/sphere";
import { Light } from "./classes/light";
import { Ray } from "./classes/ray";

import { linspace } from "./methods/linspace";
import { matrix } from "./methods/matrix";
import { generateImage } from "./methods/generate-image";

const WIDTH = 400,
  HEIGHT = 300;
const MAX_DEPTH = 3;

export function scene() {
  const gpu = new GPU({ mode: "gpu" });

  const camera: Camera = new Camera([0, 0, 1], WIDTH, HEIGHT);

  const ys = linspace(camera.screen.top, camera.screen.bottom, HEIGHT);
  const xs = linspace(camera.screen.left, camera.screen.right, WIDTH);

  const redMaterial: Material = {
    ambient: [0.1, 0, 0],
    diffuse: [0.7, 0, 0],
    specular: [1, 1, 1],
    shininess: 100,
    reflection: 0.1,
  };

  const greenMaterial: Material = {
    ambient: [0, 0.1, 0],
    diffuse: [0, 0.7, 0],
    specular: [1, 1, 1],
    shininess: 100,
    reflection: 0.4,
  };

  const blueMaterial: Material = {
    ambient: [0, 0, 0.1],
    diffuse: [0.3, 0.3, 0.9],
    specular: [1, 1, 1],
    shininess: 100,
    reflection: 0.1,
  };

  const mirrorMaterial: Material = {
    ambient: [0.1, 0.1, 0.1],
    diffuse: [0.7, 0.7, 0.7],
    specular: [1, 1, 1],
    shininess: 100,
    reflection: 0.9,
  };

  const light = new Light([1, 1, 1], [5, 5, 5]);

  const objects = [
    new Sphere(redMaterial, [-0.2, 0, -1], 0.7),
    new Sphere(greenMaterial, [-0.3, 0, 0], 0.15),
    new Sphere(blueMaterial, [0.1, -0.3, 0], 0.1),
    new Sphere(mirrorMaterial, [0, -9000, 0], 9000 - 0.7),
  ];

  const imageData = matrix(WIDTH, HEIGHT, () => [0, 0, 0]);

  for (let i = 0, y = ys[i]; i < ys.length; i++, y = ys[i]) {
    for (let j = 0, x = xs[j]; j < xs.length; j++, x = xs[j]) {
      const pixel: Vector3.T = [x, y, 0];
      const ray: Ray = new Ray(
        camera.position,
        Vector3.normalize(Vector3.subtract(pixel, camera.position))
      );

      let color: Vector3.T = [0, 0, 0];
      let reflection = 1;

      for (let k = 0; k < MAX_DEPTH; k++) {
        // check for intersections
        let d = Ray.nearestIntersectedObject(ray, objects);
        if (d.nearest === null) continue;

        // compute intersection point between ray and nearest object
        const intersection = Vector3.add(
          ray.origin,
          Vector3.scale(ray.direction, d.min)
        );
        const normalToSurface = Vector3.normalize(
          Vector3.subtract(intersection, d.nearest.position)
        );
        const shiftedPoint = Vector3.add(
          intersection,
          Vector3.scale(normalToSurface, 1e-5)
        );
        const intersectioToLight = Vector3.normalize(
          Vector3.subtract(light.position, shiftedPoint)
        );

        const d1 = Ray.nearestIntersectedObject(
          new Ray(shiftedPoint, intersectioToLight),
          objects
        );
        const intersectionToLightDistance = Vector3.linalgNorm(
          Vector3.subtract(light.position, intersection)
        );
        const isShadowed = d1.min < intersectionToLightDistance;

        if (isShadowed) continue;

        // Ambient
        const ambient = Vector3.multiply(
          d.nearest.material.ambient,
          light.color
        );

        // Diffuse
        const diffuse = Vector3.scale(
          Vector3.multiply(d.nearest.material.diffuse, light.color),
          Vector3.dot(intersectioToLight, normalToSurface)
        );

        // Specular
        const viewDirection = Vector3.normalize(
          Vector3.subtract(camera.position, intersection)
        );
        const reflectionDirection = Vector3.normalize(
          Vector3.add(intersectioToLight, viewDirection)
        );
        const specular = Vector3.scale(
          Vector3.multiply(d.nearest.material.specular, light.color),
          Math.pow(
            Vector3.dot(normalToSurface, reflectionDirection),
            d.nearest.material.shininess / 4
          )
        );

        // RGB
        const illumination = Vector3.add(ambient, diffuse, specular);

        // Reflection
        color = Vector3.add(color, Vector3.scale(illumination, reflection));
        reflection = reflection * d.nearest.material.reflection;

        ray.origin = shiftedPoint;
        ray.direction = Ray.reflect(ray, normalToSurface);
      }

      imageData[i][j] = Vector3.scale(Vector3.clip(color, 0, 1), 255);
    }
    if (i % 60 === 0) {
      console.log(`progress: ${Math.floor((i / ys.length) * 100)}%`);
    }
  }
  console.log(`progress: 100%`);

  generateImage(WIDTH, HEIGHT, imageData, "js-image.png");
}
