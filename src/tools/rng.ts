export function random<T extends number>(max: T) {
  return Math.floor(Math.random() * max) as T;
}

export function oneOf<T>(items: T[]) {
  return items[random(items.length)];
}

export function pickN<T>(items: T[], count: number) {
  const left = items.slice();
  if (count >= items.length) return left;

  const picked = new Set<T>();
  for (let i = 0; i < count; i++) {
    const item = oneOf(left);
    picked.add(item);
    left.splice(left.indexOf(item), 1);
  }

  return Array.from(picked);
}
