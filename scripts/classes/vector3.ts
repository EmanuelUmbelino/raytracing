export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static toArray(v): number[] {
    return [v.x, v.y, v.z];
  }

  static add(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  static subtract(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  static multiply(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    );
  }

  static clip(v: Vector3, min: number, max: number): Vector3 {
    for (const p in v) {
      if (v[p] < min) {
        v[p] = min;
      } else if (v[p] > max) {
        v[p] = max;
      }
    }
    return v;
  }

  static scalar(v1: Vector3, v: number): Vector3 {
    return new Vector3(v1.x * v, v1.y * v, v1.z * v);
  }

  static linalgNorm(v: Vector3): number {
    return Math.sqrt(Vector3.squared(v));
  }

  static normalize(v: Vector3): Vector3 {
    const length: number = this.linalgNorm(v);

    if (length === 0) {
      return v;
    }

    return {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length,
    };
  }

  static dot(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static squared(v: Vector3): number {
    return this.dot(v, v);
  }
}
