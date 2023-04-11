import XY from "../types/XY";

export type XYTag = `${number}_${number}`;

export function xyToTag(pos: XY): XYTag {
  return `${pos.x}_${pos.y}`;
}

export function tagToXy(tag: XYTag): XY {
  const [x, y] = tag.split("_");
  return { x: Number(x), y: Number(y) };
}
