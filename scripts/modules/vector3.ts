export module Vector3 {
  export type T = [number, number, number];

  export function add(vec: Vector3.T, ...vecs: Vector3.T[]): Vector3.T {
    const result: Vector3.T = [vec[0], vec[1], vec[2]];
    for (let vec of vecs) {
      result[0] += vec[0];
      result[1] += vec[1];
      result[2] += vec[2];
    }
    return result;
  }

  export function subtract(vec: Vector3.T, ...vecs: Vector3.T[]): Vector3.T {
    const result: Vector3.T = [vec[0], vec[1], vec[2]];
    for (let vec of vecs) {
      result[0] -= vec[0];
      result[1] -= vec[1];
      result[2] -= vec[2];
    }
    return result;
  }

  export function multiply(vec: Vector3.T, ...vecs: Vector3.T[]): Vector3.T {
    const result: Vector3.T = [vec[0], vec[1], vec[2]];
    for (let vec of vecs) {
      result[0] *= vec[0];
      result[1] *= vec[1];
      result[2] *= vec[2];
    }
    return result;
  }

  export function clip(vec: Vector3.T, min: number, max: number): Vector3.T {
    for (const p in vec) {
      if (vec[p] < min) {
        vec[p] = min;
      } else if (vec[p] > max) {
        vec[p] = max;
      }
    }
    return vec;
  }

  export function scale(vec: Vector3.T, scalar: number): Vector3.T {
    return [vec[0] * scalar, vec[1] * scalar, vec[2] * scalar];
  }

  export function linalgNorm(vec: Vector3.T): number {
    return Math.sqrt(Vector3.squared(vec));
  }

  export function normalize(vec: Vector3.T): Vector3.T {
    const length: number = this.linalgNorm(vec);

    if (length === 0) {
      return vec;
    }

    return [vec[0] / length, vec[1] / length, vec[2] / length];
  }

  export function dot(v1: Vector3.T, v2: Vector3.T): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  export function squared(v: Vector3.T): number {
    return this.dot(v, v);
  }
}
