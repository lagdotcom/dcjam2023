import Engine, { MapData, SerializedEngine, WallType } from "./Engine";
import { ScriptData } from "./EngineInkScripting";
import { applyOverlay, Overlay } from "./tools/overlays";
import { WallTag, wallToTag } from "./tools/wallTags";
import { XYTag, xyToTag } from "./tools/xyTags";
import Dir from "./types/Dir";
import XY from "./types/XY";

type Overlays = Set<Overlay>;
type KnownCells = Set<XYTag>;
type KnownWalls = Map<WallTag, WallType>;

function condense(data: WallType) {
  const dTag = data.canSeeDoor ? "d" : "";
  const sTag = data.isSolid ? "s" : "";
  const wTag = data.canSeeWall ? "w" : "";
  return `${dTag}${sTag}${wTag}` as const;
}

export default class MapDataManager {
  currentArea: string;
  allCells: Map<string, KnownCells>;
  cells: KnownCells;
  allOverlays: Map<string, Overlays>;
  overlays: Overlays;
  allWalls: Map<string, KnownWalls>;
  walls: KnownWalls;
  allScripts: Map<string, ScriptData>;

  constructor(public g: Engine) {
    this.currentArea = "";
    this.allCells = new Map();
    this.cells = new Set();
    this.allOverlays = new Map();
    this.overlays = new Set();
    this.allWalls = new Map();
    this.walls = new Map();
    this.allScripts = new Map();
  }

  clear() {
    this.currentArea = "";

    this.allCells.clear();
    this.cells.clear();
    this.allOverlays.clear();
    this.overlays.clear();
    this.allWalls.clear();
    this.walls.clear();
    this.allScripts.clear();
  }

  saveScriptState() {
    if (this.currentArea)
      this.allScripts.set(this.currentArea, this.g.scripting.saveState());
  }

  enter(name: string) {
    this.saveScriptState();

    const cells = this.allCells.get(name);
    const overlays = this.allOverlays.get(name);
    const walls = this.allWalls.get(name);
    const script = this.allScripts.get(name);

    if (cells) this.cells = cells;
    else {
      this.cells = new Set();
      this.allCells.set(name, this.cells);
    }

    if (overlays) {
      this.overlays = overlays;
      for (const overlay of overlays) applyOverlay(this.g, overlay);
    } else {
      this.overlays = new Set();
      this.allOverlays.set(name, this.overlays);
    }

    if (walls) this.walls = walls;
    else {
      this.walls = new Map();
      this.allWalls.set(name, this.walls);
    }

    if (script) this.g.scripting.loadState(script);

    this.currentArea = name;
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

  update(overlay: Overlay) {
    // TODO remove conflicting overlays?
    this.overlays.add(overlay);
  }

  serialize(): SerializedEngine["maps"] {
    this.saveScriptState();

    const data: SerializedEngine["maps"] = {};

    for (const name of this.allCells.keys()) {
      const cells = this.allCells.get(name);
      const overlays = this.allOverlays.get(name);
      const script = this.allScripts.get(name) ?? {};
      const walls = this.allWalls.get(name)?.entries();

      const entry: MapData = { cells: [], overlays: [], script, walls: {} };

      if (cells) entry.cells = Array.from(cells);
      if (overlays) entry.overlays = Array.from(overlays);
      if (walls)
        entry.walls = Object.fromEntries(
          Array.from(walls).map(([key, data]) => [key, condense(data)]),
        );

      data[name] = entry;
    }

    return data;
  }

  load(data: SerializedEngine["maps"]) {
    this.clear();

    for (const name in data) {
      const { cells, overlays, script, walls } = data[name];

      this.allCells.set(name, new Set(cells));
      this.allOverlays.set(name, new Set(overlays));
      this.allScripts.set(name, script);
      this.allWalls.set(
        name,
        new Map(
          Object.entries(walls).map(([tag, condensed]) => [
            tag as WallTag,
            {
              canSeeDoor: condensed.includes("d"),
              isSolid: condensed.includes("s"),
              canSeeWall: condensed.includes("w"),
            },
          ]),
        ),
      );
    }
  }
}
