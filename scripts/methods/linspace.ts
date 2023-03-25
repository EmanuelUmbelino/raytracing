export function linspace(start: number, stop: number, num: number): number[] {
  if (num === 1) {
    return [start + (stop - start) / 2];
  }
  const step = (stop - start) / (num - 1);
  const result: number[] = [];
  for (let i: number = 0; i < num; i++) {
    result.push(start + i * step);
  }
  return result;
}
