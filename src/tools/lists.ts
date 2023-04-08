export function niceList(items: string[]) {
  if (items.length === 0) return "nobody";
  if (items.length === 1) return items[0];

  const firstBunch = items.slice(0, -1);
  const last = items.at(-1) ?? "nobody";
  return `${firstBunch.join(", ")} and ${last}`;
}

export function pluralS(items: unknown[]) {
  if (items.length === 1) return "s";
  return "";
}
