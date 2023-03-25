// Generate a 2 dimentional array, each element with v
export function matrix(w: number, h: number, v: any) {
  const arr: any[] = [];
  for (let i = 0; i < h; i++) {
    const child: any[] = [];
    for (let j = 0; j < w; j++) {
      child.push(v());
    }
    arr.push(child);
  }
  return arr;
}
