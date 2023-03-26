import { GPU } from "gpu.js";

import { Camera } from "./classes/camera";
import { Film } from "./classes/film";
import { Scene } from "./classes/scene";

import { linspace } from "./methods/linspace";

const WIDTH = 400,
  HEIGHT = 300;

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

  film.saveImage("image.png");
  console.log(`new image generated!\n`);
}
