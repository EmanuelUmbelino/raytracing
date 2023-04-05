import { Matrix4 } from "../../modules/matrix4";
import { Vector3 } from "../../modules/vector3";

import { Ray } from "../ray";

export abstract class Shape {
  position: Vector3.T;

  matrix: Matrix4.T = Matrix4.identity();
  matrixInv: Matrix4.T | undefined = Matrix4.identity();
  invUpdated: boolean = true;

  protected abstract _intersect(ray: Ray): number[] | null;

  abstract normalIntersect(intersection: Vector3.T): Vector3.T;

  intersect(ray: Ray): number | null {
    if (!this.invUpdated) {
      this.matrixInv = Matrix4.inverse(this.matrix);
      this.invUpdated = true;
    }
    if (this.matrixInv) {
      const localOrigin = Vector3.applyMatrix4(ray.origin, this.matrixInv);
      const localDirection = Vector3.normalize(
        Vector3.applyMatrix4(ray.direction, this.matrixInv)
      );
      ray = new Ray(localOrigin, localDirection);
    }

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
    if (angleX !== undefined && angleX !== 0)
      this.matrix = Matrix4.multiply(
        this.matrix,
        Matrix4.makeRotationX(angleX)
      );
    if (angleY !== undefined && angleY !== 0)
      this.matrix = Matrix4.multiply(
        this.matrix,
        Matrix4.makeRotationY(angleY)
      );
    if (angleZ !== undefined && angleZ !== 0)
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
