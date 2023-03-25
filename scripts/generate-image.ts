import { GPU } from "gpu.js";

import { Material, SimpleMaterial } from "./interfaces/material";

import { Camera } from "./classes/camera";
import { Sphere } from "./classes/sphere";
import { Vector3 } from "./classes/vector3";
import { Light } from "./classes/light";
import { Obj } from "./classes/object";
import { Ray } from "./classes/ray";

import { linspace } from "./methods/linspace";
import { matrix } from "./methods/matrix";
import { generateImage } from "./methods/generate-image";

const WIDTH = 400,
  HEIGHT = 300;

function nearestIntersectedObject(objs: Obj[], ray: Ray) {
  const distances: (number | null)[] = [];
  objs.forEach((obj) => {
    let intersect = obj.intersect(ray);
    let d: any =
      intersect !== null && intersect[0] > 0 && intersect[1] > 0
        ? Math.min(...intersect)
        : null;
    distances.push(d);
  });

  let nearest: Obj | null = null;
  let min: number = Number.POSITIVE_INFINITY;
  for (
    let i = 0, d = distances[i];
    i < distances.length;
    i++, d = distances[i]
  ) {
    if (d !== null && d < min) {
      min = d;
      nearest = objs[i];
    }
  }
  return { nearest, min };
}

export function scene() {
  const camera: Camera = new Camera({ x: 0, y: 0, z: 1 }, WIDTH, HEIGHT);

  const ys = linspace(camera.screen.top, camera.screen.bottom, HEIGHT);
  const xs = linspace(camera.screen.left, camera.screen.right, WIDTH);

  const lightMaterial: SimpleMaterial = {
    ambient: { x: 1, y: 1, z: 1 },
    diffuse: { x: 1, y: 1, z: 1 },
    specular: { x: 1, y: 1, z: 1 },
  };

  const redMaterial: Material = {
    ambient: { x: 0.1, y: 0, z: 0 },
    diffuse: { x: 0.7, y: 0, z: 0 },
    specular: { x: 1, y: 1, z: 1 },
    shininess: 100,
    reflection: 0.1,
  };

  const greenMaterial: Material = {
    ambient: { x: 0, y: 0.1, z: 0 },
    diffuse: { x: 0, y: 0.7, z: 0 },
    specular: { x: 1, y: 1, z: 1 },
    shininess: 100,
    reflection: 0.4,
  };

  const blueMaterial: Material = {
    ambient: { x: 0.1, y: 0.1, z: 0.5 },
    diffuse: { x: 0.3, y: 0.3, z: 0.9 },
    specular: { x: 1, y: 1, z: 1 },
    shininess: 100,
    reflection: 0.1,
  };

  const mirrorMaterial: Material = {
    ambient: { x: 0.1, y: 0.1, z: 0.1 },
    diffuse: { x: 0.7, y: 0.7, z: 0.7 },
    specular: { x: 1, y: 1, z: 1 },
    shininess: 100,
    reflection: 0.9,
  };

  const light = new Light(lightMaterial, new Vector3(5, 5, 5));

  const objects = [
    new Sphere(redMaterial, new Vector3(-0.2, 0, -1), 0.7),
    new Sphere(greenMaterial, new Vector3(-0.3, 0, 0), 0.15),
    new Sphere(blueMaterial, new Vector3(0.1, -0.3, 0), 0.1),
    new Sphere(mirrorMaterial, new Vector3(0, -9000, 0), 9000 - 0.7),
  ];

  const imageData = matrix(WIDTH, HEIGHT, () => new Vector3(0, 0, 0));

  let total = 0,
    colidiu = 0,
    apareceu = 0;

  for (let i = 0, y = ys[i]; i < ys.length; i++, y = ys[i]) {
    for (let j = 0, x = xs[j]; j < xs.length; j++, x = xs[j]) {
      total++;

      const pixel = new Vector3(x, y, 0);
      const ray: Ray = new Ray(
        camera.position,
        Vector3.normalize(Vector3.subtract(pixel, camera.position))
      );

      let color: Vector3 = {
        x: 0,
        y: 0,
        z: 0,
      };

      // check for intersections
      const d = nearestIntersectedObject(objects, ray);
      if (d.nearest === null) continue;
      colidiu++;

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

      const d1 = nearestIntersectedObject(objects, {
        origin: shiftedPoint,
        direction: intersectioToLight,
      });
      const intersectionToLightDistance = Vector3.linalgNorm(
        Vector3.subtract(light.position, intersection)
      );
      const isShadowed = d1.min < intersectionToLightDistance;

      if (isShadowed) continue;
      apareceu++;

      color = d.nearest.material.diffuse;

      imageData[i][j] = color;
    }
    if (i % 60 === 0) {
      console.log(`progress: ${Math.floor((i / ys.length) * 100)}%`);
    }
  }
  console.log(`progress: 100%`);
  console.log(total, colidiu, apareceu);

  generateImage(WIDTH, HEIGHT, imageData, "js-image.png");
}
