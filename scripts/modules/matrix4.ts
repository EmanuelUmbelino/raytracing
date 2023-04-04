import { Vector3 } from "./vector3";

export module Matrix4 {
    type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

    export type T = _TupleOf<number, 16, []>;
    
    export function copy(matrix: T): T {
        const m: T = new Array(16) as T;
        m[0] = matrix[0]; m[4] = matrix[4]; m[8] = matrix[8]; m[12] = matrix[12];
        m[1] = matrix[1]; m[5] = matrix[5]; m[9] = matrix[9]; m[13] = matrix[13];
        m[2] = matrix[2]; m[6] = matrix[6]; m[10] = matrix[10]; m[14] = matrix[14];
        m[3] = matrix[3]; m[7] = matrix[7]; m[11] = matrix[11]; m[15] = matrix[15];

        return m;
    }
  
    export function identity(): T {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    export function makeRotationX(angle: number): T {
        const c = Math.cos(angle), s = Math.sin(angle);

        return [
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ];
    }

    export function makeRotationY(angle: number): T {
        const c = Math.cos(angle), s = Math.sin(angle);

        return [
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ];
    }
    export function makeRotationZ(angle: number): T {
        const c = Math.cos(angle), s = Math.sin(angle);

        return [
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    
    export function makeScale(vector: Vector3.T): T {
        const x = vector[0], y = vector[1], z = vector[2]; 

        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ];
    }

    export function makeTranslate(vector: Vector3.T): T {
        const x = vector[0], y = vector[1], z = vector[2]; 

        return [
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ];
    }

    export function transpose(matrix: T): T {

        return [
            matrix[0], matrix[4], matrix[8],  matrix[12],
            matrix[1], matrix[5], matrix[9],  matrix[13],
            matrix[2], matrix[6], matrix[10], matrix[14],
            matrix[3], matrix[7], matrix[11], matrix[15],
        ];
    }

    export function multiply(m1: T, m2: T): T {
        const mR: T = [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    mR[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j];
                }
            }
        }

        return mR;
    }
}