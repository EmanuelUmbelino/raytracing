import { Matrix4 } from "./matrix4";

export module Vector3 {
  export type T = [number, number, number];

  export function copy(vec: T): T {
    return [vec[0], vec[1], vec[2]];
  }

  export function add(vec: T, ...vecs: T[]): T {
    const result: T = copy(vec);

    for (let vec of vecs) {
      result[0] += vec[0];
      result[1] += vec[1];
      result[2] += vec[2];
    }
    return result;
  }

  export function subtract(vec: T, ...vecs: T[]): T {
    const result: T = copy(vec);

    for (let vec of vecs) {
      result[0] -= vec[0];
      result[1] -= vec[1];
      result[2] -= vec[2];
    }
    return result;
  }

  export function multiply(vec: T, ...vecs: T[]): T {
    const result: T = copy(vec);

    for (let vec of vecs) {
      result[0] *= vec[0];
      result[1] *= vec[1];
      result[2] *= vec[2];
    }
    return result;
  }

  export function divide(vec: T, ...vecs: T[]): T {
    const result: T = copy(vec);

    for (let vec of vecs) {
      result[0] /= vec[0];
      result[1] /= vec[1];
      result[2] /= vec[2];
    }
    return result;
  }

  export function clip(vec: T, min: number, max: number): T {
    for (const p in vec) {
      if (vec[p] < min) {
        vec[p] = min;
      } else if (vec[p] > max) {
        vec[p] = max;
      }
    }
    return vec;
  }

  export function scale(vec: T, scalar: number): T {
    return [vec[0] * scalar, vec[1] * scalar, vec[2] * scalar];
  }

  export function scaleDivide(vec: T, scalar: number): T {
    return [vec[0] / scalar, vec[1] / scalar, vec[2] / scalar];
  }

  export function linalgNorm(vec: T): number {
    return Math.sqrt(squared(vec));
  }

  export function normalize(vec: T): T {
    const length: number = linalgNorm(vec);

    if (length === 0) {
      return vec;
    }

    return [vec[0] / length, vec[1] / length, vec[2] / length];
  }

  export function dot(v1: T, v2: T): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  export function squared(v: T): number {
    return dot(v, v);
  }

  export function reflect(v: T, n: T): T {
    return subtract(v, scale(n, 2 * dot(v, n)));
  }

  export function distance(v1: T, v2: T) {
    let sqSum = 0;
    for (let i = 0; i < v1.length; i++) {
      sqSum += Math.pow(v2[i] - v1[i], 2);
    }
    return Math.sqrt(sqSum);
  }

  export function min(v1: T, v2: T): T {
    return [
      Math.min(v1[0], v2[0]),
      Math.min(v1[1], v2[1]),
      Math.min(v1[2], v2[2]),
    ];
  }

  export function max(v1: T, v2: T): T {
    return [
      Math.max(v1[0], v2[0]),
      Math.max(v1[1], v2[1]),
      Math.max(v1[2], v2[2]),
    ];
  }

  export function applyMatrix4(vector: T, matrix: Matrix4.T): T {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];

    const newX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
    const newY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
    const newZ = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];

    return [newX, newY, newZ];
  }
}
