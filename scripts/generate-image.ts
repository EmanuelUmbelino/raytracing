import { Camera } from "./classes/camera";
import { linspace } from "./linspace";
import { GPU } from "gpu.js";
import * as Jimp from "jimp";
import { Sphere } from "./classes/sphere";
import { Material } from "./interfaces/material";
import { Vector3 } from "./classes/vector3";
import { Obj } from "./classes/object";
import { Ray } from "./classes/ray";

const WIDTH = 400,
  HEIGHT = 300;

function nearestIntersectedObject(objs: Obj[], ray: Ray) {
  const distances: (number | null)[] = [];
  objs.forEach((obj) => {
    let intersect = obj.intersect(ray);
    let d: any = intersect === null ? intersect : Math.min(...intersect);
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

export function generateImage() {
  const camera: Camera = new Camera({ x: 0, y: 0, z: 1 }, WIDTH, HEIGHT);

  const ys = linspace(camera.screen.top, camera.screen.bottom, HEIGHT);
  const xs = linspace(camera.screen.left, camera.screen.right, WIDTH);

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
    ambient: { x: 0, y: 0, z: 0.1 },
    diffuse: { x: 0, y: 0, z: 0.7 },
    specular: { x: 1, y: 1, z: 1 },
    shininess: 100,
    reflection: 0.5,
  };

  const objects = [
    new Sphere(redMaterial, new Vector3(-0.2, 0, -1), 0.7),
    new Sphere(greenMaterial, new Vector3(-0.3, 0, 0), 0.15),
    new Sphere(blueMaterial, new Vector3(0.1, -0.3, 0), 0.1),
  ];

  let total = 0,
    colidiu = 0,
    apareceu = 0;

  new Jimp(WIDTH, HEIGHT, function (err, image) {
    console.log("err", err, ys.length, xs.length);
    if (err) throw err;

    for (let i = 0, y = ys[i]; i < ys.length; i++, y = ys[i]) {
      for (let j = 0, x = xs[j]; j < xs.length; j++, x = xs[j]) {
        total++;
        const pixel = new Vector3(x, y, 0);
        const ray: Ray = {
          origin: camera.position,
          direction: Vector3.normalize(
            Vector3.subtract(pixel, camera.position)
          ),
        };

        let color: Vector3 = {
          x: 0,
          y: 0,
          z: 0,
        };
        const d = nearestIntersectedObject(objects, ray);
        if (d.nearest !== null) {
          color = d.nearest.material.diffuse;
          colidiu++;
        }
        const hex = Jimp.rgbaToInt(
          color.x * 255,
          color.y * 255,
          color.z * 255,
          255
        );
        image.setPixelColor(hex, j, i);
      }
    }

    image.write("test.png", (err) => {
      if (err) throw err;
    });
    console.log(total, colidiu, apareceu);
  });
}
