import * as Jimp from "jimp";

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
        const color = imageData[i][j];
        const hex = Jimp.rgbaToInt(color.x, color.y, color.z, 255);
        image.setPixelColor(hex, j, i);
      }
    }
    image.write(imageName, (err) => {
      if (err) throw err;
    });
  });
}
