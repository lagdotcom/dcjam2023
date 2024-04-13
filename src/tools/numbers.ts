export function wrap<T extends number>(n: T, max: T) {
  const m = n % max;
  return m < 0 ? m + max : m;
}
