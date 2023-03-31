export default function uniq<T>(items: T[]): T[] {
  const set = new Set<T>(items);
  return Array.from(set.values());
}
