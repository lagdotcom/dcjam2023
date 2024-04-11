import Dir from "../types/Dir";
import { Cells } from "../types/flavours";
import XY from "../types/XY";

export type WallTag = `${number},${number},${Dir}`;

export function wallToTag(pos: XY<Cells>, dir: Dir): WallTag {
  return `${pos.x},${pos.y},${dir}`;
}

export function tagToWall(tag: WallTag): [XY<Cells>, Dir] {
  const [x, y, dir] = tag.split(",");
  return [{ x: Number(x), y: Number(y) }, Number(dir)];
}
