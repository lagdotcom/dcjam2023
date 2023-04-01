import random from "./random";

export default function oneOf<T>(items: T[]) {
  const index = random(items.length);
  return items[index];
}
