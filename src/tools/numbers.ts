export function wrap(n: number, max: number) {
  const m = n % max;
  return m < 0 ? m + max : m;
}
