import XY from "../types/XY";

export type XYTag = `${number}_${number}`;

export function xyToTag<T extends number>(pos?: XY<T>): XYTag {
  if (!pos) return "-1_-1";
  return `${pos.x}_${pos.y}`;
}

export function tagToXy<T extends number>(tag: XYTag): XY<T> {
  const [x, y] = tag.split("_");
  return { x: Number(x), y: Number(y) } as XY<T>;
}
