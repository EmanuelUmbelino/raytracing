// Generate a 2 dimentional array, each element with value
export function matrix(w: number, h: number, v: (x, y) => any): any[][] {
  const arr: any[] = [];
  for (let i = 0; i < h; i++) {
    const child: any[] = [];
    for (let j = 0; j < w; j++) {
      child.push(v(j, i));
    }
    arr.push(child);
  }
  return arr;
}
