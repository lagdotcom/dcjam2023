import { XYTag, xyToTag } from "./tools/xyTags";
import { move, rotate, xy } from "./tools/geometry";

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

interface RenderSetup {
  dungeon: DungeonRenderer;
  log: LogRenderer;
  minimap: MinimapRenderer;
  stats: StatsRenderer;
}

export default class Engine {
  ctx: CanvasRenderingContext2D;
  drawSoon: Soon;
  facing: Dir;
  log: string[];
  party: Player[];
  position: XY;
  renderSetup?: RenderSetup;
  res: ResourceManager;
  showLog: boolean;
  scripting: EngineScripting;
  visited: Map<string, Set<XYTag>>;
  world?: World;
  worldSize: XY;
  worldVisited: Set<XYTag>;

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
    this.visited = new Map();
    this.worldVisited = new Set();
    this.party = [
      new Player("A"),
      new Player("B"),
      new Player("C"),
      new Player("D"),
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
    this.worldVisited.add(xyToTag(this.position));

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

  draw() {
    this.drawSoon.schedule();
  }

  render = () => {
    const { ctx, renderSetup } = this;
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);

    if (!renderSetup) {
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
      this.worldVisited.add(xyToTag(this.position));
      this.draw();

      this.scripting.onEnter(this.position, old);
    }
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
}
