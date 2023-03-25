// Generate a 2 dimentional array, each element with v
export function matrix(w: number, h: number, v: any = 0) {
  return new Array(h).fill(Array(w).fill(v));
}
