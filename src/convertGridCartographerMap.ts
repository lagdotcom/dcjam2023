import Grid from "./Grid";
import { getResourceURL } from "./resources";
import { dirFromInitial, xy } from "./tools/geometry";
import isDefined from "./tools/isDefined";
import { openGate } from "./tools/sides";
import { XYTag, xyToTag } from "./tools/xyTags";
import Dir from "./types/Dir";
import {
  AtlasLayerID,
  Cells,
  MapFloor,
  MapRegion,
  ResourceURL,
  TextureIndex,
} from "./types/flavours";
import { Edge, GCMap, Note } from "./types/GCMap";
import {
  AtlasReference,
  WallDecalType,
  WorldCell,
  WorldSide,
} from "./types/World";
import XY from "./types/XY";

interface EdgeSide {
  decal?: WallDecalType;
  wall?: boolean;
  solid?: boolean;
}
interface EdgeEntry {
  main: EdgeSide;
  opposite: EdgeSide;
}

const wall: EdgeSide = { wall: true, solid: true };
const door: EdgeSide = { decal: "Door", wall: true };
const locked: EdgeSide = { decal: "Door", wall: true, solid: true };
const invisible: EdgeSide = { solid: true };
const fake: EdgeSide = { wall: true };
const sign: EdgeSide = { decal: "Sign", wall: true, solid: true };
const gate: EdgeSide = { decal: "Gate", wall: false, solid: true };
const lever: EdgeSide = { decal: "Lever", wall: true, solid: true };

const defaultEdge: EdgeEntry = { main: wall, opposite: wall };

const EdgeDetails: Partial<Record<Edge, EdgeEntry>> = {
  [Edge.Door]: { main: door, opposite: door },
  [Edge.Door_Box]: { main: door, opposite: door },
  [Edge.Door_Locked]: { main: locked, opposite: locked },
  [Edge.Door_OneWayRD]: { main: door, opposite: wall },
  [Edge.Door_OneWayLU]: { main: wall, opposite: door },
  [Edge.Wall_Secret]: { main: invisible, opposite: invisible },
  [Edge.Wall_OneWayRD]: { main: fake, opposite: wall },
  [Edge.Wall_OneWayLU]: { main: wall, opposite: fake },
  [Edge.Message]: { main: sign, opposite: sign },
  [Edge.Gate]: { main: gate, opposite: gate },
  [Edge.Bars]: { main: fake, opposite: fake },
  // this isn't a mistake...
  [Edge.LeverLU]: { main: lever, opposite: wall },
  [Edge.LeverRD]: { main: wall, opposite: lever },
};

function compareNotes(a: Note, b: Note) {
  if (a.x !== b.x) return a.x - b.x;
  if (a.y !== b.y) return a.y - b.y;
  return 0;
}

class GCMapConverter {
  atlases: AtlasReference[];
  decals: Map<string, AtlasLayerID>;
  definitions: Map<string, number>;
  facing: Dir;
  grid: Grid<WorldCell, Cells>;
  scripts: ResourceURL[];
  start: XY<Cells>;
  startsOpen: Set<XYTag>;
  textures: Map<TextureIndex, number>;

  constructor(env: Record<string, number> = {}) {
    this.atlases = [];
    this.decals = new Map();
    this.definitions = new Map(Object.entries(env));
    this.facing = Dir.N;
    this.grid = new Grid(() => ({
      sides: {},
      tags: [],
      strings: {},
      numbers: {},
      verbs: {},
    }));
    this.scripts = [];
    this.start = xy(0, 0);
    this.startsOpen = new Set();
    this.textures = new Map();

    this.definitions.set("NORTH", Dir.N);
    this.definitions.set("EAST", Dir.E);
    this.definitions.set("SOUTH", Dir.S);
    this.definitions.set("WEST", Dir.W);
  }

  tile(x: Cells, y: Cells) {
    return this.grid.getOrDefault({ x, y });
  }

  convert(j: GCMap, region: MapRegion = 0, floor: MapFloor = 0) {
    if (!(region in j.regions)) throw new Error(`No such region: ${region}`);
    const r = j.regions[region];

    const f = r.floors.find((f) => f.index === floor);
    if (!f) throw new Error(`No such floor: ${floor}`);

    for (const note of f.notes.sort(compareNotes)) {
      // TODO these values are incorrect if origin is "bl"
      const { __data, x, y } = note;

      for (const line of __data?.split("\n") ?? []) {
        if (!line.startsWith("#")) continue;

        const [cmd, ...args] = line.split(" ");
        this.applyCommand(cmd, args.join(" "), x, y);
      }
    }

    for (const row of f.tiles.rows ?? []) {
      let x = f.tiles.bounds.x0 + row.start;
      const y =
        r.setup.origin === "tl"
          ? row.y
          : f.tiles.bounds.height - (row.y - f.tiles.bounds.y0) - 1;

      for (const tile of row.tdata) {
        const mt = this.tile(x, y);
        const tag = xyToTag({ x, y });
        if (tile.t) mt.floor = this.getTexture(tile.tc);

        // TODO different ceiling textures?
        // if (tile.c) mt.ceiling = this.getTexture(0);
        mt.ceiling = this.getTexture(0);

        if (tile.b)
          this.setEdge(
            tile.b,
            tile.bc,
            mt,
            Dir.S,
            this.tile(x, y + 1),
            Dir.N,
            this.startsOpen.has(tag),
          );

        if (tile.r)
          this.setEdge(
            tile.r,
            tile.rc,
            mt,
            Dir.E,
            this.tile(x + 1, y),
            Dir.W,
            this.startsOpen.has(tag),
          );

        x++;
      }
    }

    const { atlases, definitions, scripts, start, facing } = this;
    const name = `${r.name}_F${f.index}`;
    const cells = this.grid.asArray();
    return { name, atlases, cells, definitions, scripts, start, facing };
  }

  getTexture(index: TextureIndex = 0) {
    const texture = this.textures.get(index);
    if (!isDefined(texture))
      throw new Error(`Unknown texture for palette index ${index}`);

    return texture;
  }

  eval(s: string) {
    const def = this.definitions.get(s);
    if (isDefined(def)) return def;

    const num = Number(s);
    if (!isNaN(num)) return num;

    throw new Error(`Could not evaluate: ${s}`);
  }

  applyCommand(cmd: string, arg: string, x: Cells, y: Cells) {
    switch (cmd.toUpperCase()) {
      case "#ATLAS":
        this.atlases.push(
          ...arg.split(",").map((name) => ({
            image: getResourceURL(name + ".png"),
            json: getResourceURL(name + ".json"),
          })),
        );
        return;

      case "#DEFINE": {
        const [key, value] = arg.split(",");
        if (this.definitions.has(key))
          throw new Error(`Already defined: ${key}`);
        this.definitions.set(key, this.eval(value));
        return;
      }

      case "#STYLE": {
        const [index, value] = arg.split(",");
        this.textures.set(this.eval(index), this.eval(value));
        return;
      }

      case "#DECAL": {
        const [name, texture, decal] = arg.split(",");
        this.decals.set(`${name},${this.eval(texture)}`, this.eval(decal));
        return;
      }

      case "#START":
        this.start = { x, y };
        this.facing = dirFromInitial(arg);
        return;

      case "#TAG": {
        const t = this.tile(x, y);
        for (const tag of arg.split(",")) t.tags.push(tag);
        break;
      }

      case "#SCRIPT":
        for (const id of arg.split(",")) this.scripts.push(getResourceURL(id));
        break;

      case "#OBJECT":
        this.tile(x, y).object = this.eval(arg);
        break;

      case "#STRING": {
        const [name, ...args] = arg.split(",");
        this.tile(x, y).strings[name] = args.join(",").replace(/\\n/g, "\n");
        break;
      }

      case "#NUMBER": {
        const [name, value] = arg.split(",");
        this.tile(x, y).numbers[name] = this.eval(value);
        break;
      }

      case "#OPEN":
        this.startsOpen.add(xyToTag({ x, y }));
        break;

      case "#VERB": {
        const [dir, value] = arg.split(",");
        this.tile(x, y).verbs[dirFromInitial(dir)] = value;
        break;
      }

      default:
        throw new Error(`Unknown command: ${cmd} ${arg} at (${x},${y})`);
    }
  }

  setEdge(
    edge: Edge,
    index: TextureIndex | undefined,
    lt: WorldCell,
    ld: Dir,
    rt: WorldCell,
    rd: Dir,
    opened: boolean,
  ) {
    const { main, opposite } = EdgeDetails[edge] ?? defaultEdge;
    const texture = this.getTexture(index);

    const leftSide: WorldSide = {
      wall: main.wall ? texture : undefined,
      decalType: main.decal,
      decal: this.decals.get(`${main.decal ?? ""},${texture}`),
      solid: main.solid,
    };
    lt.sides[ld] = leftSide;

    const rightSide: WorldSide = {
      wall: opposite.wall ? texture : undefined,
      decalType: opposite.decal,
      decal: this.decals.get(`${opposite.decal ?? ""},${texture}`),
      solid: opposite.solid,
    };
    rt.sides[rd] = rightSide;

    if (opened) {
      openGate(leftSide);
      openGate(rightSide);
    }
  }
}

export default function convertGridCartographerMap(
  j: GCMap,
  region: MapRegion = 0,
  floor: MapFloor = 0,
  env: Record<string, number> = {},
) {
  const converter = new GCMapConverter(env);
  return converter.convert(j, region, floor);
}
