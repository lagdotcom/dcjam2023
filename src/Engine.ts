import Combatant, { AttackableStat, BoostableStat } from "./types/Combatant";
import Game, { GameEffect } from "./types/Game";
import {
  GameEventListeners,
  GameEventName,
  GameEventNames,
  GameEvents,
} from "./types/events";
import { WallTag, wallToTag } from "./tools/wallTags";
import { XYTag, xyToTag } from "./tools/xyTags";
import {
  getCardinalOffset,
  getDirOffset,
  move,
  rotate,
  xyi,
} from "./tools/geometry";

import CombatManager from "./CombatManager";
import CombatRenderer from "./CombatRenderer";
import DefaultControls from "./DefaultControls";
import Dir from "./types/Dir";
import DungeonRenderer from "./DungeonRenderer";
import { EnemyName, EnemyObjects } from "./enemies";
import EngineScripting from "./EngineScripting";
import GameInput from "./types/GameInput";
import HUDRenderer from "./HUDRenderer";
import CombatAction from "./types/CombatAction";
import LogRenderer from "./LogRenderer";
import Player from "./Player";
import ResourceManager from "./ResourceManager";
import Soon from "./Soon";
import World from "./types/World";
import XY from "./types/XY";
import clone from "nanoclone";
import convertGridCartographerMap from "./convertGridCartographerMap";
import getCanvasContext from "./tools/getCanvasContext";
import { getResourceURL } from "./resources";
import parse from "./DScript/parser";
import withTextStyle from "./tools/withTextStyle";
import { pickN, random } from "./tools/rng";
import getKeyNames from "./tools/getKeyNames";
import { contains } from "./tools/aabb";
import { wrap } from "./tools/numbers";
import Item from "./types/Item";
import { Predicate, matchAll } from "./types/logic";
import HasHotspots from "./types/HasHotspots";

type WallType = { canSeeDoor: boolean; isSolid: boolean; canSeeWall: boolean };

interface RenderSetup {
  dungeon: DungeonRenderer;
  hud: HUDRenderer;
  log: LogRenderer;
  combat: CombatRenderer;
}

const calculateEventName = {
  dr: "onCalculateDR",
  maxHP: "onCalculateMaxHP",
  maxSP: "onCalculateMaxSP",
  camaraderie: "onCalculateCamaraderie",
  determination: "onCalculateDetermination",
  spirit: "onCalculateSpirit",
} as const satisfies Record<BoostableStat, GameEventName>;

export default class Engine implements Game {
  combat: CombatManager;
  controls: Map<string, GameInput[]>;
  ctx: CanvasRenderingContext2D;
  drawSoon: Soon;
  eventHandlers: GameEventListeners;
  facing: Dir;
  inventory: Item[];
  log: string[];
  party: Player[];
  pendingEnemies: EnemyName[];
  position: XY;
  renderSetup?: RenderSetup;
  res: ResourceManager;
  showLog: boolean;
  scripting: EngineScripting;
  spotElements: HasHotspots[];
  visited: Map<string, Set<XYTag>>;
  walls: Map<string, Map<WallTag, WallType>>;
  world?: World;
  worldSize: XY;
  worldVisited: Set<XYTag>;
  worldWalls: Map<WallTag, WallType>;
  zoomRatio: number;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = getCanvasContext(canvas, "2d");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.eventHandlers = Object.fromEntries(
      GameEventNames.map((name) => [name, new Set()])
    );
    this.zoomRatio = 1;
    this.controls = new Map(DefaultControls);
    this.facing = Dir.N;
    this.position = xyi(0, 0);
    this.worldSize = xyi(0, 0);
    this.res = new ResourceManager();
    this.drawSoon = new Soon(this.render);
    this.scripting = new EngineScripting(this);
    this.log = [];
    this.showLog = false;
    this.combat = new CombatManager(this);
    this.visited = new Map();
    this.walls = new Map();
    this.worldVisited = new Set();
    this.worldWalls = new Map();
    this.inventory = [];
    this.pendingEnemies = [];
    this.spotElements = [];
    this.party = [
      new Player(this, "Martialist"),
      new Player(this, "Cleavesman"),
      new Player(this, "War Caller"),
      new Player(this, "Loam Seer"),
    ];

    canvas.addEventListener("keyup", (e) => {
      const keys = getKeyNames(e.code, e.shiftKey, e.altKey, e.ctrlKey);
      for (const key of keys) {
        const input = this.controls.get(key);
        if (input) {
          e.preventDefault();

          for (const check of input) {
            if (this.processInput(check)) return;
          }
        }
      }
    });

    const transform = (e: MouseEvent): XY =>
      xyi(e.offsetX / this.zoomRatio, e.offsetY / this.zoomRatio);

    canvas.addEventListener("mousemove", (e) => this.onMouseMove(transform(e)));
    canvas.addEventListener("click", (e) => this.onClick(transform(e)));
  }

  getSpot(pos: XY) {
    for (const element of this.spotElements) {
      const spot = element.spots.find((s) => contains(s, pos));
      if (spot) return { element, spot };
    }
  }

  onMouseMove(pos: XY) {
    const result = this.getSpot(pos);
    this.canvas.style.cursor = result?.spot.cursor ?? "";
  }

  onClick(pos: XY) {
    const result = this.getSpot(pos);
    if (result) result.element.spotClicked(result.spot);
  }

  processInput(i: GameInput): boolean {
    switch (i) {
      case "Forward":
        return this.move(this.facing);
      case "SlideRight":
        return this.move(rotate(this.facing, 1));
      case "Back":
        return this.move(rotate(this.facing, 2));
      case "SlideLeft":
        return this.move(rotate(this.facing, 3));
      case "TurnLeft":
        return this.turn(-1);
      case "TurnRight":
        return this.turn(1);
      case "ToggleLog":
        return this.toggleLog();
      case "Interact":
        return this.interact(this.facing);
      case "MenuDown":
        return this.menuMove(1);
      case "MenuUp":
        return this.menuMove(-1);
      case "MenuChoose":
        return this.menuChoose();
      case "RotateLeft":
        return this.partyRotate(-1);
      case "RotateRight":
        return this.partyRotate(1);
      case "SwapLeft":
        return this.partySwap(-1);
      case "SwapRight":
        return this.partySwap(1);
      case "SwapBehind":
        return this.partySwap(2);
    }
  }

  async loadWorld(w: World, position?: XY) {
    this.renderSetup = undefined;

    this.world = clone(w);
    this.worldSize = xyi(this.world.cells[0].length, this.world.cells.length);
    this.position = position ?? w.start;
    this.facing = w.facing;

    const combat = new CombatRenderer(this);
    const hud = new HUDRenderer(this);
    const log = new LogRenderer(this);

    const [atlas, image, enemyAtlas, enemyImage] = await Promise.all([
      this.res.loadAtlas(w.atlas.json),
      this.res.loadImage(w.atlas.image),
      this.res.loadAtlas(getResourceURL("enemies.json")),
      this.res.loadImage(getResourceURL("enemies.png")),
      hud.acquireImages(),
    ]);
    const dungeon = new DungeonRenderer(this, atlas, image);

    await dungeon.addAtlas(atlas.layers, image);
    await dungeon.addAtlas(enemyAtlas.layers, enemyImage);
    dungeon.dungeon.layers.push(...enemyAtlas.layers);

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

    this.spotElements = [hud.skills, hud.stats];
    this.renderSetup = { combat, dungeon, hud, log };
    return this.draw();
  }

  async loadGCMap(jsonUrl: string, region: number, floor: number) {
    this.renderSetup = undefined;

    const map = await this.res.loadGCMap(jsonUrl);
    const { atlas, cells, scripts, start, facing, name } =
      convertGridCartographerMap(map, region, floor, EnemyObjects);
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

    const cell = this.world?.cells[y][x];

    if (cell && this.combat.inCombat) {
      const result = getCardinalOffset(this.position, { x, y });
      if (result) {
        const enemy = this.combat.getFromOffset(result.dir, result.offset);
        // show the enemy sprite instead of whatever is there (temporarily)
        if (enemy) {
          const replaced = clone(cell);
          replaced.object = enemy.template.object;
          return replaced;
        }
      }
    }

    return cell;
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

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    if (!renderSetup) {
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white",
      });
      draw(
        `Loading: ${this.res.loaded}/${this.res.loading}`,
        width / 2,
        height / 2
      );

      this.draw();
      return;
    }

    renderSetup.dungeon.render();
    renderSetup.hud.render();
    if (this.showLog) renderSetup.log.render();
    if (this.combat.inCombat) renderSetup.combat.render();
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

    return true;
  }

  move(dir: Dir) {
    if (this.combat.inCombat) return false;

    if (this.canMove(dir)) {
      const old = this.position;
      this.position = move(this.position, dir);
      this.markVisited();
      this.markNavigable(old, dir);
      this.draw();

      this.scripting.onEnter(this.position, old);
      return true;
    }

    this.markUnnavigable(this.position, dir);
    return false;
  }

  toggleLog() {
    this.showLog = !this.showLog;
    this.draw();
    return true;
  }

  interact(index: number) {
    if (!this.party[index].alive) return false;
    if (this.combat.inCombat) return false;

    return this.scripting.onInteract(index);
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
    this.combat.index = 0;
    this.facing = rotate(this.facing, clockwise);
    this.draw();
    return true;
  }

  menuMove(mod: number) {
    if (!this.combat.inCombat) return false;
    if (this.combat.side === "enemy") return false;

    const actions = this.party[this.facing].actions;
    const index = wrap(this.combat.index + mod, actions.length);
    this.combat.index = index;
    this.draw();
    return true;
  }

  canAct(who: Combatant, action: CombatAction) {
    if (!who.alive) return false;
    if (who.usedThisTurn.has(action.name)) return false;

    const e = this.fire("onCanAct", { who, action, cancel: false });
    if (e.cancel) return false;

    if (action.sp > who.sp) return false;

    return true;
  }

  menuChoose() {
    if (!this.combat.inCombat) return false;
    if (this.combat.side === "enemy") return false;

    const pc = this.party[this.facing];
    const action = pc.actions[this.combat.index];
    if (!action) return false;

    if (!this.canAct(pc, action)) return false;

    const { possibilities, amount } = this.getTargetPossibilities(pc, action);
    if (!possibilities.length) return false;

    // TODO give ability to pick targets...
    const targets = pickN(
      possibilities.filter((c) => c.alive),
      amount
    );

    this.act(pc, action, targets);
    return true;
  }

  getOpponent(me: Combatant, turn = 0) {
    const { dir: myDir, distance } = this.combat.getPosition(me);
    const dir = rotate(myDir, turn);

    return me.isPC
      ? this.combat.enemies[dir][0]
      : distance === 0
      ? this.party[dir]
      : undefined;
  }

  getAllies(me: Combatant, includeMe: boolean) {
    const allies: Combatant[] = me.isPC ? this.party : this.combat.allEnemies;
    return includeMe ? allies : allies.filter((c) => c !== me);
  }

  getTargetPossibilities(
    c: Combatant,
    a: CombatAction
  ): { amount: number; possibilities: Combatant[] } {
    if (a.targets.type === "self") return { amount: 1, possibilities: [c] };

    const amount = a.targets.count ?? Infinity;

    const filters: Predicate<Combatant>[] = [
      a.targets.type === "ally"
        ? (o) => o.isPC === c.isPC
        : (o) => o.isPC !== c.isPC,
    ];

    if (a.targetFilter) filters.push(a.targetFilter);

    const { distance, offsets } = a.targets;
    const me = this.combat.getPosition(c);

    if (offsets)
      filters.push((o) => {
        const them = this.combat.getPosition(o);
        return offsets.includes(getDirOffset(me.dir, them.dir));
      });

    if (typeof distance === "number")
      filters.push((o) => {
        const them = this.combat.getPosition(o);
        const diff = Math.abs(them.distance - me.distance);
        return diff <= distance;
      });

    return {
      amount,
      possibilities: this.combat.aliveCombatants.filter(matchAll(filters)),
    };
  }

  addToLog(message: string) {
    this.log.push(message);
    this.showLog = true;
    this.draw();
  }

  fire<T extends GameEventName>(name: T, e: GameEvents[T]) {
    const handlers = this.eventHandlers[name];
    for (const handler of handlers) handler(e);
    return e;
  }

  act(me: Combatant, action: CombatAction, targets: Combatant[]) {
    const x = action.x ? me.sp : action.sp;
    me.sp -= x;
    me.usedThisTurn.add(action.name);

    const msg = (action.useMessage ?? `[NAME] uses ${action.name}!`).replace(
      "[NAME]",
      me.name
    );
    if (msg) this.addToLog(msg);
    else this.draw();

    const e = this.fire("onBeforeAction", {
      attacker: me,
      action,
      targets,
      cancel: false,
    });
    if (e.cancel) return;

    action.act({ g: this, targets, me, x });

    me.lastAction = action.name;
    if (action.name === "Attack") {
      me.attacksInARow++;
    } else me.attacksInARow = 0;
  }

  endTurn() {
    this.combat.endTurn();
  }

  addEffect(makeEffect: (destroy: () => void) => GameEffect) {
    const effect = makeEffect(() => this.removeEffect(effect));

    this.combat.effects.push(effect);
    for (const name of GameEventNames) {
      const handler = effect[name];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (handler) this.eventHandlers[name].add(handler);
    }
  }

  removeEffect(effect: GameEffect) {
    const index = this.combat.effects.indexOf(effect);
    if (index >= 0) this.combat.effects.splice(index, 1);

    for (const name of GameEventNames) {
      const handler = effect[name];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (handler) this.eventHandlers[name].delete(handler);
    }
  }

  roll(size: number) {
    const value = random(size) + 1;
    this.fire("onRoll", { size, value });
    return value;
  }

  applyStatModifiers(who: Combatant, stat: BoostableStat, value: number) {
    const event = calculateEventName[stat];
    return this.fire(event, { who, value }).value;
  }

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: AttackableStat
  ) {
    let total = 0;

    for (const target of targets) {
      const damage = this.fire("onCalculateDamage", {
        attacker,
        target,
        amount,
        type,
      });

      const resist = type === "hp" ? target.dr : 0;

      const deal = Math.floor(damage.amount - resist);
      if (deal > 0) {
        total += deal;
        target[type] -= deal;
        this.draw();

        const message =
          type === "hp"
            ? `${target.name} takes ${deal} damage.`
            : `${target.name} loses ${deal} ${type}.`;
        this.addToLog(message);

        if (target.hp < 1) this.kill(target, attacker);

        this.fire("onAfterDamage", { attacker, target, amount, type });
      }
    }

    return total;
  }

  heal(healer: Combatant, targets: Combatant[], amount: number) {
    for (const target of targets) {
      const newHP = Math.min(target.hp + amount, target.maxHP);
      const gain = newHP - target.hp;
      if (gain) {
        target.hp = newHP;
        this.draw();

        const message = `${target.name} heals for ${gain}.`;
        this.addToLog(message);
      }
    }
  }

  kill(who: Combatant, attacker: Combatant) {
    who.hp = 0;
    this.addToLog(`${who.name} dies!`);
    this.fire("onKilled", { who, attacker });

    const alive = this.party.find((pc) => pc.alive);
    const winners = alive
      ? this.combat.allEnemies.length === 0
        ? "party"
        : undefined
      : "enemies";

    if (winners) {
      if (alive) this.addToLog(`You have vanquished your foes.`);
      else this.addToLog(`You have failed.`);

      this.fire("onCombatOver", { winners });
      // TODO item drops
    }
  }

  partyRotate(dir: -1 | 1) {
    if (this.combat.inCombat) {
      const immobile = this.party.find((pc) => !pc.canMove);
      if (immobile) return false;

      for (const pc of this.party) pc.move();
    }

    if (dir === -1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const north = this.party.shift()!;
      this.party.push(north);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const west = this.party.pop()!;
      this.party.unshift(west);
    }

    // TODO: replace with return this.turn(rotate(this.facing, dir)) ?
    this.draw();
    return true;
  }

  partySwap(side: number) {
    const dir = rotate(this.facing, side);

    const me = this.party[this.facing];
    const them = this.party[dir];

    if (this.combat.inCombat) {
      if (!me.canMove || !them.canMove) return false;

      me.move();
      them.move();
    }

    this.party[this.facing] = them;
    this.party[dir] = me;

    // TODO: replace with return this.turn(side) ?
    this.draw();
    return true;
  }
}
