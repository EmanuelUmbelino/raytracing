import { Matrix4 } from "../../modules/matrix4";
import { Vector3 } from "../../modules/vector3";

import { Ray } from "../ray";

export abstract class Shape {
  position: Vector3.T;

  matrix: Matrix4.T = Matrix4.identity();
  matrixInv: Matrix4.T | undefined = Matrix4.identity();
  invUpdated: boolean = true;

  protected abstract _intersect(ray: Ray): number[] | null;

  normalIntersect(intersection: Vector3.T): Vector3.T {
    return Vector3.normalize(Vector3.subtract(intersection, this.position));
  }

  intersect(ray: Ray): number | null {
    const distance = this._intersect(ray);
    if (
      distance !== null &&
      distance.filter((el) => el > 0).length === distance.length
    ) {
      return Math.min(...distance);
    }
    return null;
  }

  rotate(angleX?: number, angleY?: number, angleZ?: number) {
    if (angleX)
      this.matrix = Matrix4.multiply(
        this.matrix,
        Matrix4.makeRotationX(angleX)
      );
    if (angleY)
      this.matrix = Matrix4.multiply(
        this.matrix,
        Matrix4.makeRotationY(angleY)
      );
    if (angleZ)
      this.matrix = Matrix4.multiply(
        this.matrix,
        Matrix4.makeRotationY(angleZ)
      );
    this.invUpdated = false;
  }

  scale(v: Vector3.T) {
    this.matrix = Matrix4.multiply(this.matrix, Matrix4.makeScale(v));
    this.invUpdated = false;
  }
}
