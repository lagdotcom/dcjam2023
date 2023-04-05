export function intersection<T>(a: T[], b: T[]) {
  return a.filter((item) => b.includes(item));
}
