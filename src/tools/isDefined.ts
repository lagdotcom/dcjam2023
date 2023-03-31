export default function isDefined<T>(item?: T): item is T {
  return typeof item !== "undefined";
}
