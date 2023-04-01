import Game, { DamageType, GameEffect } from "./types/Game";
import { GameEventListener, GameEventName, GameEvents } from "./types/events";
import { WallTag, wallToTag } from "./tools/wallTags";
import { XYTag, xyToTag } from "./tools/xyTags";
import { move, rotate, xy } from "./tools/geometry";

import Combatant from "./types/Combatant";
import Dir from "./types/Dir";
import DungeonRenderer from "./DungeonRenderer";
import EngineScripting from "./EngineScripting";
import LogRenderer from "./LogRenderer";
import MinimapRenderer from "./MinimapRenderer";
import Player from "./Player";
import ResourceManager from "./ResourceManager";
import Soon from "./Soon";
import StatsRenderer from "./StatsRenderer";
import World from "./types/World";
import XY from "./types/XY";
import clone from "nanoclone";
import convertGridCartographerMap from "./convertGridCartographerMap";
import getCanvasContext from "./tools/getCanvasContext";
import parse from "./DScript/parser";
import withTextStyle from "./withTextStyle";

type WallType = { canSeeDoor: boolean; isSolid: boolean; canSeeWall: boolean };

interface RenderSetup {
  dungeon: DungeonRenderer;
  log: LogRenderer;
  minimap: MinimapRenderer;
  stats: StatsRenderer;
}

export default class Engine implements Game {
  ctx: CanvasRenderingContext2D;
  drawSoon: Soon;
  effects: GameEffect[];
  facing: Dir;
  log: string[];
  party: Player[];
  position: XY;
  renderSetup?: RenderSetup;
  res: ResourceManager;
  showLog: boolean;
  scripting: EngineScripting;
  visited: Map<string, Set<XYTag>>;
  walls: Map<string, Map<WallTag, WallType>>;
  world?: World;
  worldSize: XY;
  worldVisited: Set<XYTag>;
  worldWalls: Map<WallTag, WallType>;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = getCanvasContext(canvas, "2d");

    this.facing = Dir.N;
    this.position = xy(0, 0);
    this.worldSize = xy(0, 0);
    this.res = new ResourceManager();
    this.drawSoon = new Soon(this.render);
    this.scripting = new EngineScripting(this);
    this.log = [];
    this.showLog = false;
    this.effects = [];
    this.visited = new Map();
    this.walls = new Map();
    this.worldVisited = new Set();
    this.worldWalls = new Map();
    this.party = [
      new Player("A", "Brawler"),
      new Player("B", "Bard"),
      new Player("C", "Knight"),
      new Player("D", "Thief"),
    ];

    canvas.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft") this.turn(-1);
      else if (e.code === "ArrowRight") this.turn(1);
      else if (e.code === "ArrowUp") this.move(this.facing);
      else if (e.code === "ArrowDown") this.move(rotate(this.facing, 2));
      else if (e.code === "KeyQ") this.move(rotate(this.facing, 3));
      else if (e.code === "KeyE") this.move(rotate(this.facing, 1));
      else if (e.code === "Space") {
        e.preventDefault();
        this.showLog = !this.showLog;
        this.draw();
      }
    });
  }

  async loadWorld(w: World, position?: XY) {
    this.renderSetup = undefined;

    this.world = clone(w);
    this.worldSize = xy(this.world.cells[0].length, this.world.cells.length);
    this.position = position ?? w.start;
    this.facing = w.facing;

    const [atlas, image] = await Promise.all([
      this.res.loadAtlas(w.atlas.json),
      this.res.loadImage(w.atlas.image),
    ]);
    const dungeon = new DungeonRenderer(this, atlas, image);
    const minimap = new MinimapRenderer(this);
    const stats = new StatsRenderer(this);
    const log = new LogRenderer(this);

    await dungeon.generateImages();

    const visited = this.visited.get(w.name);
    if (visited) this.worldVisited = visited;
    else {
      this.worldVisited = new Set();
      this.visited.set(w.name, this.worldVisited);
    }

    const walls = this.walls.get(w.name);
    if (walls) this.worldWalls = walls;
    else {
      this.worldWalls = new Map();
      this.walls.set(w.name, this.worldWalls);
    }

    this.markVisited();

    this.renderSetup = { dungeon, log, minimap, stats };
    return this.draw();
  }

  async loadGCMap(jsonUrl: string, region: number, floor: number) {
    this.renderSetup = undefined;

    const map = await this.res.loadGCMap(jsonUrl);
    const { atlas, cells, scripts, start, facing, name } =
      convertGridCartographerMap(map, region, floor);
    if (!atlas) throw new Error(`${jsonUrl} did not contain #ATLAS`);

    // TODO how about clearing old script stuff...?
    const codeFiles = await Promise.all(
      scripts.map((url) => this.res.loadScript(url))
    );
    for (const code of codeFiles) {
      const program = parse(code);
      this.scripting.run(program);
    }

    return this.loadWorld({ name, atlas, cells, start, facing });
  }

  isVisited(x: number, y: number) {
    const tag = xyToTag({ x, y });
    return this.worldVisited.has(tag);
  }

  getCell(x: number, y: number) {
    if (x < 0 || x >= this.worldSize.x || y < 0 || y >= this.worldSize.y)
      return;

    return this.world?.cells[y][x];
  }

  findCellWithTag(tag: string) {
    if (!this.world) return;

    for (let y = 0; y < this.worldSize.y; y++) {
      for (let x = 0; x < this.worldSize.x; x++) {
        if (this.world.cells[y][x].tags.includes(tag)) return { x, y };
      }
    }
  }

  draw() {
    this.drawSoon.schedule();
  }

  render = () => {
    const { ctx, renderSetup } = this;
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);

    if (!renderSetup) {
      const { draw } = withTextStyle(ctx, "center", "middle", "white");
      draw(
        `Loading: ${this.res.loaded}/${this.res.loading}`,
        width / 2,
        height / 2
      );

      this.draw();
      return;
    }

    renderSetup.dungeon.render();
    renderSetup.stats.render();
    renderSetup.minimap.render();
    if (this.showLog) renderSetup.log.render();
  };

  canMove(dir: Dir) {
    // has something gone badly wrong?
    const at = this.getCell(this.position.x, this.position.y);
    if (!at) return false;

    // is there a wall in the way?
    const wall = at.sides[dir];
    if (wall?.solid) return false;

    // is there anywhere to move to??
    const destination = move(this.position, dir);
    const cell = this.getCell(destination.x, destination.y);
    if (!cell) return false;

    // TODO etc. etc.
    return true;
  }

  move(dir: Dir) {
    if (this.canMove(dir)) {
      const old = this.position;
      this.position = move(this.position, dir);
      this.markVisited();
      this.markNavigable(old, dir);
      this.draw();

      this.scripting.onEnter(this.position, old);
    } else this.markUnnavigable(this.position, dir);
  }

  markVisited() {
    const pos = this.position;
    const tag = xyToTag(pos);
    const cell = this.getCell(pos.x, pos.y);

    if (!this.worldVisited.has(tag) && cell) {
      this.worldVisited.add(tag);

      for (let dir = 0; dir <= 3; dir++) {
        const wall = cell.sides[dir as Dir];
        const canSeeDoor = wall?.decalType === "Door";
        const hasTexture = typeof wall?.wall === "number";
        const looksSolid = hasTexture;
        const data: WallType = {
          canSeeDoor,
          isSolid: looksSolid && !canSeeDoor,
          canSeeWall: hasTexture,
        };

        this.worldWalls.set(wallToTag(pos, dir), data);
      }
    }
  }

  markNavigable(pos: XY, dir: Dir) {
    const tag = wallToTag(pos, dir);
    const data: WallType = this.worldWalls.get(tag) ?? {
      canSeeDoor: false,
      isSolid: false,
      canSeeWall: false,
    };

    if (data.isSolid) {
      data.isSolid = false;
      this.worldWalls.set(tag, data);
    }
  }

  markUnnavigable(pos: XY, dir: Dir) {
    const tag = wallToTag(pos, dir);
    const data: WallType = this.worldWalls.get(tag) ?? {
      canSeeDoor: false,
      isSolid: false,
      canSeeWall: false,
    };

    if (!data.isSolid) {
      data.isSolid = true;
      this.worldWalls.set(tag, data);
      this.draw();
    }
  }

  getMinimapData(x: number, y: number) {
    if (!this.isVisited(x, y)) return {};

    const cell = this.getCell(x, y);
    const north = this.getWallData(x, y, Dir.N);
    const east = this.getWallData(x, y, Dir.E);
    const south = this.getWallData(x, y, Dir.S);
    const west = this.getWallData(x, y, Dir.W);
    return { cell, north, east, south, west };
  }

  getWallData(x: number, y: number, dir: Dir) {
    const wallData = this.worldWalls.get(wallToTag({ x, y }, dir));

    const dTag = wallData?.canSeeDoor ? "d" : "";
    const sTag = wallData?.isSolid ? "s" : "";
    const wTag = wallData?.canSeeWall ? "w" : "";
    return `${dTag}${sTag}${wTag}` as const;
  }

  turn(clockwise: number) {
    this.facing = rotate(this.facing, clockwise);
    this.draw();
  }

  addToLog(message: string) {
    this.log.push(message);
    this.showLog = true;
    this.draw();
  }

  getHandlers<T extends GameEventName>(name: T) {
    const handlers: GameEventListener[T][] = [];

    for (const effect of this.effects) {
      const handler = effect[name];
      if (handler) handlers.push(handler);
    }

    return handlers;
  }

  fire<T extends GameEventName>(name: T, e: GameEvents[T]) {
    const handlers = this.getHandlers(name);
    for (const handler of handlers) handler(e);
    return e;
  }

  addEffect(effect: GameEffect): void {
    this.effects.push(effect);
  }

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: DamageType
  ): void {
    for (const target of targets) {
      const damage = this.fire("onCalculateDamage", {
        attacker,
        target,
        amount,
        type,
      });

      const resist =
        type === "hp"
          ? this.fire("onCalculateDR", { who: target, dr: target.dr }).dr
          : 0;

      const deal = Math.floor(damage.amount) - Math.floor(resist);
      if (deal > 0) {
        target[type] -= deal;
        this.draw();

        // TODO dying etc.
      }
    }
  }
}
