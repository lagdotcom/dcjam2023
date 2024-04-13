import { XYTag, xyToTag } from "./tools/xyTags";
import XY from "./types/XY";

export default class Grid<TItem, TCoord extends number> {
  entries: Map<XYTag, TItem>;
  width: TCoord;
  height: TCoord;

  constructor(
    public defaultValue: (xy: XY<TCoord>) => TItem,
    public toTag: (xy: XY<TCoord>) => XYTag = xyToTag,
  ) {
    this.entries = new Map();
    this.width = 0 as TCoord;
    this.height = 0 as TCoord;
  }

  set(xy: XY<TCoord>, item: TItem) {
    const tag = this.toTag(xy);
    this.entries.set(tag, item);
    this.width = Math.max(this.width, xy.x + 1) as TCoord;
    this.height = Math.max(this.height, xy.y + 1) as TCoord;
  }

  get(xy: XY<TCoord>) {
    return this.entries.get(this.toTag(xy));
  }

  getOrDefault(xy: XY<TCoord>) {
    const existing = this.get(xy);
    if (existing) return existing;

    const value = this.defaultValue(xy);
    this.set(xy, value);
    return value;
  }

  asArray() {
    const rows: TItem[][] = [];
    for (let y = 0 as TCoord; y < this.height; y++) {
      const row: TItem[] = [];
      for (let x = 0 as TCoord; x < this.width; x++)
        row.push(this.getOrDefault({ x, y }));

      rows.push(row);
    }

    return rows;
  }
}
