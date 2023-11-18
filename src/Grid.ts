import { XYTag, xyToTag } from "./tools/xyTags";
import XY from "./types/XY";

export default class Grid<T> {
  entries: Map<XYTag, T>;
  width: number;
  height: number;

  constructor(
    public defaultValue: (xy: XY) => T,
    public toTag: (xy: XY) => XYTag = xyToTag,
  ) {
    this.entries = new Map();
    this.width = 0;
    this.height = 0;
  }

  set(xy: XY, item: T) {
    const tag = this.toTag(xy);
    this.entries.set(tag, item);
    this.width = Math.max(this.width, xy.x + 1);
    this.height = Math.max(this.height, xy.y + 1);
  }

  get(xy: XY) {
    return this.entries.get(this.toTag(xy));
  }

  getOrDefault(xy: XY) {
    const existing = this.get(xy);
    if (existing) return existing;

    const value = this.defaultValue(xy);
    this.set(xy, value);
    return value;
  }

  asArray() {
    const rows: T[][] = [];
    for (let y = 0; y < this.height; y++) {
      const row: T[] = [];
      for (let x = 0; x < this.width; x++)
        row.push(this.getOrDefault({ x, y }));

      rows.push(row);
    }

    return rows;
  }
}
