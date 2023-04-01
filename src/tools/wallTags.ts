import Dir from "../types/Dir";
import XY from "../types/XY";

export type WallTag = `${number},${number},${Dir}`;

export function wallToTag(pos: XY, dir: Dir): WallTag {
  return `${pos.x},${pos.y},${dir}`;
}

export function tagToWall(tag: WallTag): [XY, Dir] {
  const [x, y, dir] = tag.split(",");
  return [{ x: Number(x), y: Number(y) }, Number(dir)];
}
