import { GPU } from "gpu.js";

import { Vector3 } from "./modules/vector3";

import { Camera } from "./classes/camera";
import { Sphere } from "./classes/sphere";
import { Light } from "./classes/light";
import { Ray } from "./classes/ray";
import { Material } from "./classes/material";
import { Instance } from "./classes/instance";
import { Film } from "./classes/film";
import { Scene } from "./classes/scene";

import { linspace } from "./methods/linspace";

const WIDTH = 400,
  HEIGHT = 300;
const MAX_DEPTH = 3;

export function render() {
  const camera: Camera = new Camera([0, 0, 1], WIDTH, HEIGHT);

  const film: Film = new Film(WIDTH, HEIGHT);

  const scene: Scene = new Scene();

  console.log(`render started...`);
  const ys = linspace(camera.screen.top, camera.screen.bottom, HEIGHT);
  const xs = linspace(camera.screen.left, camera.screen.right, WIDTH);
  for (let i = 0; i < HEIGHT; i++) {
    if (i % 60 === 0) {
      console.log(`progress: ${Math.floor((i / HEIGHT) * 100)}%`);
    }
    for (let j = 0; j < WIDTH; j++) {
      const pixel = film.getSample(xs[j], ys[i]);
      const ray = camera.generateRay(pixel);
      const color = scene.traceRay(ray);

      film.setPixelColor(i, j, color);
    }
  }
  console.log(`progress: 100%`);

  film.saveImage("nova.png");
  console.log(`new image generated!\n`);
}

export function old() {
  const camera: Camera = new Camera([0, 0, 1], WIDTH, HEIGHT);

  const film: Film = new Film(WIDTH, HEIGHT);

  const ys = linspace(camera.screen.top, camera.screen.bottom, HEIGHT);
  const xs = linspace(camera.screen.left, camera.screen.right, WIDTH);

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
    reflection: 0.4,
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
    reflection: 0.9,
  });

  const light = new Instance(
    new Sphere([5, 5, 5], 0.1),
    new Light([1, 1, 1], 100)
  );

  const objects = [
    new Instance(new Sphere([-0.2, 0, -1], 0.7), redMaterial),
    new Instance(new Sphere([-0.3, 0, 0], 0.15), greenMaterial),
    new Instance(new Sphere([0.1, -0.3, 0], 0.1), blueMaterial),
    new Instance(new Sphere([0, -9000, 0], 9000 - 0.7), mirrorMaterial),
  ];

  for (let i = 0, y = ys[i]; i < ys.length; i++, y = ys[i]) {
    if (i % 60 === 0) {
      console.log(`progress: ${Math.floor((i / ys.length) * 100)}%`);
    }
    for (let j = 0, x = xs[j]; j < xs.length; j++, x = xs[j]) {
      const pixel: Vector3.T = film.getSample(x, y);
      const ray: Ray = camera.generateRay(pixel);

      let color: Vector3.T = [0, 0, 0];
      let reflection = 1;

      for (let k = 0; k < MAX_DEPTH; k++) {
        // check for intersections
        const { nearest, min } = Ray.nearestIntersectedObject(ray, objects);
        if (nearest === null) continue;

        // compute intersection point between ray and nearest object
        const intersection = Vector3.add(
          ray.origin,
          Vector3.scale(ray.direction, min)
        );
        const normalToSurface = Vector3.normalize(
          Vector3.subtract(intersection, nearest.shape.position)
        );
        const shiftedPoint = Vector3.add(
          intersection,
          Vector3.scale(normalToSurface, 1e-5)
        );
        const intersectioToLight = Vector3.normalize(
          Vector3.subtract(light.shape.position, shiftedPoint)
        );

        const min2 = Ray.nearestIntersectedObject(
          new Ray(shiftedPoint, intersectioToLight),
          objects
        ).min;
        const intersectionToLightDistance = Vector3.linalgNorm(
          Vector3.subtract(light.shape.position, intersection)
        );
        const isShadowed = min2 < intersectionToLightDistance;

        if (isShadowed) continue;

        // Ambient
        const ambient = Vector3.multiply(
          nearest.material.ambient,
          light.light.color
        );

        // Diffuse
        const diffuse = Vector3.scale(
          Vector3.multiply(nearest.material.diffuse, light.light.color),
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
          Vector3.multiply(nearest.material.specular, light.light.color),
          Math.pow(
            Vector3.dot(normalToSurface, reflectionDirection),
            nearest.material.shininess / 4
          )
        );

        // RGB
        const illumination = Vector3.add(ambient, diffuse, specular);

        // Reflection
        color = Vector3.add(color, Vector3.scale(illumination, reflection));
        reflection = reflection * nearest.material.reflection;

        ray.origin = shiftedPoint;
        ray.direction = Ray.reflect(ray, normalToSurface);
      }

      film.setPixelColor(i, j, Vector3.scale(Vector3.clip(color, 0, 1), 255));
    }
  }
  console.log(`progress: 100%`);

  film.saveImage("js-image.png");

  console.log(`image generated!\n`);
}
