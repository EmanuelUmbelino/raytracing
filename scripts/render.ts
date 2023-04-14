import { GPU } from "gpu.js";
import * as fs from "fs";

import { Vector3 } from "./modules/vector3";

import { Camera } from "./classes/camera";
import { Film } from "./classes/film";
import { Scene } from "./classes/scene";

import { linspace } from "./methods/linspace";

export function render(
  width = 400,
  height = 300,
  antialising = 4,
  maxDepth = 10
) {
  const date = new Date();

  const camera: Camera = new Camera([-0.1, 0, 1], width, height);

  const film: Film = new Film(width, height, antialising);

  const scene: Scene = new Scene(maxDepth);

  console.log(`render started...`);
  const ys = linspace(camera.screen.top, camera.screen.bottom, height);
  const xs = linspace(camera.screen.left, camera.screen.right, width);

  const start = performance.now();
  for (let i = 0; i < height; i++) {
    if (i % 60 === 0) {
      console.log(`progress: ${Math.floor((i / height) * 100)}%`);
    }

    for (let j = 0; j < width; j++) {
      let color: Vector3.T = [0, 0, 0];
      for (let k = 1; k < antialising; k++) {
        const pixel = film.getSample(xs[j], ys[i]);
        const ray = camera.generateRay(pixel);
        color = Vector3.add(color, scene.traceRay(ray));
      }
      film.setPixelColor(i, j, Vector3.scaleDivide(color, antialising));
    }
  }
  const end = performance.now();
  const executionTimeSec = Math.round(end - start) / 1000;
  console.log(`progress: 100%`);

  film.saveImage("image.png");
  console.log(`new image generated!\n`);
  console.log(`it took ${executionTimeSec} sec\n`);

  const data = {
    date: date.toLocaleString(),
    executionTimeSec,
    width,
    height,
    antialising,
    maxDepth,
    objs: scene.instances.length - scene.lightSources.length,
    lights: scene.lightSources.length,
  };
  fs.readFile("log.json", "utf8", function (err, fileData) {
    fileData = JSON.parse(fileData);
    fileData[date.toJSON()] = data;

    fs.writeFile(
      "log.json",
      JSON.stringify(fileData, null, 2),
      "utf8",
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  });
}
