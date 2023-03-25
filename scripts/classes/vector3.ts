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

  static add(vec: Vector3, ...vecs: Vector3[]): Vector3 {
    const result = { x: vec.x, y: vec.y, z: vec.z };
    for (let vec of vecs) {
      result.x += vec.x;
      result.y += vec.y;
      result.z += vec.z;
    }
    return result;
  }

  static subtract(vec: Vector3, ...vecs: Vector3[]): Vector3 {
    const result = { x: vec.x, y: vec.y, z: vec.z };
    for (let vec of vecs) {
      result.x -= vec.x;
      result.y -= vec.y;
      result.z -= vec.z;
    }
    return result;
  }

  static multiply(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    );
  }

  static clip(vec: Vector3, min: number, max: number): Vector3 {
    for (const p in vec) {
      if (vec[p] < min) {
        vec[p] = min;
      } else if (vec[p] > max) {
        vec[p] = max;
      }
    }
    return vec;
  }

  static scale(vec: Vector3, scalar: number): Vector3 {
    return new Vector3(vec.x * scalar, vec.y * scalar, vec.z * scalar);
  }

  static linalgNorm(vec: Vector3): number {
    return Math.sqrt(Vector3.squared(vec));
  }

  static normalize(vec: Vector3): Vector3 {
    const length: number = this.linalgNorm(vec);

    if (length === 0) {
      return vec;
    }

    return {
      x: vec.x / length,
      y: vec.y / length,
      z: vec.z / length,
    };
  }

  static dot(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  static squared(v: Vector3): number {
    return this.dot(v, v);
  }
}
