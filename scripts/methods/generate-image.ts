import * as Jimp from "jimp";
import { Vector3 } from "../modules/vector3";

export function generateImage(
  width: number,
  height: number,
  imageData: any,
  imageName: string
) {
  new Jimp(width, height, function (err, image) {
    if (err) throw err;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const color: Vector3.T = imageData[i][j];
        const hex = Jimp.rgbaToInt(color[0], color[1], color[2], 255);
        image.setPixelColor(hex, j, i);
      }
    }
    image.write(imageName, (err) => {
      if (err) throw err;
    });
  });
}
