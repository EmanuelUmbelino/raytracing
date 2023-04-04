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
    
    function zero(): T {
        return [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ];
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
        const mR: T = zero();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    mR[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j];
                }
            }
        }

        return mR;
    }

    function getCofactor(m: T, temp: T, p: number, q: number, n: number): void {
        let i = 0, j = 0;
    
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                if (row != p && col != q) {
                    temp[i * 4 + j++] = m[row * 4 + col];
    
                    if (j == n - 1) {
                        j = 0;
                        i++;
                    }
                }
            }
        }
    }

    function determinant(m: T, n: number): number {
        let D = 0;
    
        if (n == 1)
            return m[0];
    
        const temp: T = zero();
    
        let sign = 1;
    
        for (let f = 0; f < n; f++) {
            getCofactor(m, temp, 0, f, n);
            D += sign * m[f] * determinant(temp, n - 1);
    
            sign = -sign;
        }
        return D;
    }

    export function adjoint(matrix: T): T {
        const adj: T = zero();
        
        let sign = 1;
        const temp: T = zero();
    
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                getCofactor(matrix, temp, i, j, 4);
    
                sign = ((i + j) % 2 == 0)? 1: -1;
    
                adj[j*4 + i] = (sign)*(determinant(temp, 4 -1));
            }
        }

        return adj;
    }
    
    export function inverse(matrix: T): T | undefined {
        const inverse: T = zero();

        const det = determinant(matrix, 4);
        if (det == 0) {
            return undefined;
        }
       
        const adj: T = adjoint(matrix);
       
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                inverse[i*4 + j] = adj[i * 4 + j]/det;
            }
        }
       
        return inverse;
    }
}