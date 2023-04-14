import { tagToWall, WallTag, wallToTag } from "./tools/wallTags";
import { tagToXy, XYTag, xyToTag } from "./tools/xyTags";
import Dir from "./types/Dir";
import XY from "./types/XY";

export interface WallType {
  canSeeDoor: boolean;
  isSolid: boolean;
  canSeeWall: boolean;
}

export type WallTypeCondensed = `${"d" | ""}${"s" | ""}${"w" | ""}`;

export interface SerializedKnownMap {
  cells: Record<string, XYTag[]>;
  walls: Record<string, Record<WallTag, WallTypeCondensed>>;
}

type KnownCells = Set<XYTag>;
type KnownWalls = Map<WallTag, WallType>;

function condense(data: WallType) {
  const dTag = data.canSeeDoor ? "d" : "";
  const sTag = data.isSolid ? "s" : "";
  const wTag = data.canSeeWall ? "w" : "";
  return `${dTag}${sTag}${wTag}` as const;
}

export default class KnownMapData {
  allCells: Map<string, KnownCells>;
  cells: KnownCells;
  allWalls: Map<string, KnownWalls>;
  walls: KnownWalls;

  constructor() {
    this.allCells = new Map();
    this.cells = new Set();
    this.allWalls = new Map();
    this.walls = new Map();
  }

  clear() {
    this.allCells.clear();
    this.cells.clear();
    this.allWalls.clear();
    this.walls.clear();
  }

  enter(name: string) {
    const cells = this.allCells.get(name);
    const walls = this.allWalls.get(name);

    if (cells) this.cells = cells;
    else {
      this.cells = new Set();
      this.allCells.set(name, this.cells);
    }

    if (walls) this.walls = walls;
    else {
      this.walls = new Map();
      this.allWalls.set(name, this.walls);
    }
  }

  isVisited(pos: XY) {
    return this.cells.has(xyToTag(pos));
  }

  visit(pos: XY) {
    this.cells.add(xyToTag(pos));
  }

  setWall(pos: XY, dir: Dir, data: WallType) {
    this.walls.set(wallToTag(pos, dir), data);
  }

  getWall(pos: XY, dir: Dir) {
    const tag = wallToTag(pos, dir);
    const data = this.walls.get(tag);
    if (data) return data;

    const newData: WallType = {
      canSeeDoor: false,
      isSolid: false,
      canSeeWall: false,
    };
    this.walls.set(tag, newData);
    return newData;
  }

  getWallCondensed(pos: XY, dir: Dir) {
    const data = this.getWall(pos, dir);
    return condense(data);
  }

  serialize(): SerializedKnownMap {
    const allCells: SerializedKnownMap["cells"] = {};
    const allWalls: SerializedKnownMap["walls"] = {};

    for (const [name, cells] of this.allCells.entries())
      allCells[name] = Array.from(cells.values());

    for (const [name, walls] of this.allWalls.entries()) {
      allWalls[name] = Object.fromEntries(
        Array.from(walls.entries()).map(([key, data]) => [key, condense(data)])
      );
    }

    return { cells: allCells, walls: allWalls };
  }

  load(data: SerializedKnownMap) {
    this.clear();

    for (const name in data.cells) {
      this.enter(name);
      for (const tag of data.cells[name]) this.visit(tagToXy(tag));
    }

    for (const name in data.walls) {
      this.enter(name);
      for (const tag in data.walls[name]) {
        const [pos, dir] = tagToWall(tag as WallTag);
        const wall: WallType = {
          canSeeDoor: false,
          isSolid: false,
          canSeeWall: false,
        };

        const condensed = data.walls[name][tag as WallTag];
        if (condensed.includes("d")) wall.canSeeDoor = true;
        if (condensed.includes("s")) wall.isSolid = true;
        if (condensed.includes("w")) wall.canSeeWall = true;

        this.setWall(pos, dir, wall);
      }
    }
  }
}
