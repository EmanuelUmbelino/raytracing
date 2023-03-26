import * as Jimp from "jimp";

import { o } from "../modules/o";

import { matrix } from "../methods/matrix";

export class Film {
  resolution: {
    w: number;
    h: number;
  };
  image: o.Vector3[][];
  antialising: number;

  constructor(w: number, h: number, antialising: number) {
    this.resolution = { w, h };
    this.image = matrix(w, h, () => [0, 0, 0]);
    this.antialising = antialising;
  }

  getSample(i: number, j: number): o.Vector3 {
    return [
      i + Math.random() / this.resolution.w,
      j + Math.random() / this.resolution.h,
      0,
    ];
  }

  setPixelColor(i: number, j: number, c: o.Vector3) {
    this.image[i][j] = c;
  }

  saveImage(imageName: string) {
    const width = this.resolution.w,
      height = this.resolution.h,
      imageData = this.image;
    new Jimp(width, height, function (err, image) {
      if (err) throw err;

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const color: o.Vector3 = imageData[i][j];
          const hex = Jimp.rgbaToInt(color[0], color[1], color[2], 255);
          image.setPixelColor(hex, j, i);
        }
      }
      image.write(imageName, (err) => {
        if (err) throw err;
      });
    });
  }
}
