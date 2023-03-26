export module o {
  export type Vector3 = [number, number, number];

  export function add(vec: o.Vector3, ...vecs: o.Vector3[]): o.Vector3 {
    const result: o.Vector3 = [vec[0], vec[1], vec[2]];
    for (let vec of vecs) {
      result[0] += vec[0];
      result[1] += vec[1];
      result[2] += vec[2];
    }
    return result;
  }

  export function subtract(vec: o.Vector3, ...vecs: o.Vector3[]): o.Vector3 {
    const result: o.Vector3 = [vec[0], vec[1], vec[2]];
    for (let vec of vecs) {
      result[0] -= vec[0];
      result[1] -= vec[1];
      result[2] -= vec[2];
    }
    return result;
  }

  export function multiply(vec: o.Vector3, ...vecs: o.Vector3[]): o.Vector3 {
    const result: o.Vector3 = [vec[0], vec[1], vec[2]];
    for (let vec of vecs) {
      result[0] *= vec[0];
      result[1] *= vec[1];
      result[2] *= vec[2];
    }
    return result;
  }

  export function clip(vec: o.Vector3, min: number, max: number): o.Vector3 {
    for (const p in vec) {
      if (vec[p] < min) {
        vec[p] = min;
      } else if (vec[p] > max) {
        vec[p] = max;
      }
    }
    return vec;
  }

  export function scale(vec: o.Vector3, scalar: number): o.Vector3 {
    return [vec[0] * scalar, vec[1] * scalar, vec[2] * scalar];
  }

  export function scaleDivide(vec: o.Vector3, scalar: number): o.Vector3 {
    return [vec[0] / scalar, vec[1] / scalar, vec[2] / scalar];
  }

  export function linalgNorm(vec: o.Vector3): number {
    return Math.sqrt(o.squared(vec));
  }

  export function normalize(vec: o.Vector3): o.Vector3 {
    const length: number = this.linalgNorm(vec);

    if (length === 0) {
      return vec;
    }

    return [vec[0] / length, vec[1] / length, vec[2] / length];
  }

  export function dot(v1: o.Vector3, v2: o.Vector3): number {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  export function squared(v: o.Vector3): number {
    return this.dot(v, v);
  }

  export function reflect(v: o.Vector3, n: o.Vector3): o.Vector3 {
    return o.subtract(v, o.scale(n, 2 * o.dot(v, n)));
  }

  export function distance(v1: o.Vector3, v2: o.Vector3) {
    let sqSum = 0;
    for (let i = 0; i < v1.length; i++) {
      sqSum += Math.pow(v2[i] - v1[i], 2);
    }
    return Math.sqrt(sqSum);
  }
}
