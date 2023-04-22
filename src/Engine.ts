import clone from "nanoclone";

import { endTurnAction } from "./actions";
import { loadIntoArea, partyDied, saveGame, startArea } from "./analytics";
import CombatManager from "./CombatManager";
import CombatRenderer from "./CombatRenderer";
import convertGridCartographerMap from "./convertGridCartographerMap";
import DefaultControls from "./DefaultControls";
import DungeonRenderer from "./DungeonRenderer";
import { EnemyName, EnemyObjects } from "./enemies";
import EngineInkScripting, { ScriptData } from "./EngineInkScripting";
import HUDRenderer from "./HUDRenderer";
import { getItem } from "./items";
import Jukebox from "./Jukebox";
import LogRenderer from "./LogRenderer";
import MapDataManager from "./MapDataManager";
import Player, { SerializedPlayer } from "./Player";
import ResourceManager from "./ResourceManager";
import { getResourceURL } from "./resources";
import { validateEngine } from "./schemas";
import DeathScreen from "./screens/DeathScreen";
import DungeonScreen from "./screens/DungeonScreen";
import LoadingScreen from "./screens/LoadingScreen";
import SplashScreen from "./screens/SplashScreen";
import StatsScreen from "./screens/StatsScreen";
import Soon from "./Soon";
import Sounds from "./Sounds";
import { contains } from "./tools/aabb";
import removeItem from "./tools/arrays";
import {
  getCardinalOffset,
  getDirOffset,
  move,
  rotate,
  sameXY,
  xyi,
} from "./tools/geometry";
import getCanvasContext from "./tools/getCanvasContext";
import isDefined from "./tools/isDefined";
import { wrap } from "./tools/numbers";
import { pickN, random } from "./tools/rng";
import { WallTag } from "./tools/wallTags";
import { tagToXy, XYTag, xyToTag } from "./tools/xyTags";
import CombatAction from "./types/CombatAction";
import Combatant, { AttackableStat, BoostableStat } from "./types/Combatant";
import Dir from "./types/Dir";
import {
  GameEventListeners,
  GameEventName,
  GameEventNames,
  GameEvents,
} from "./types/events";
import Game, { GameEffect } from "./types/Game";
import GameInput from "./types/GameInput";
import { GameScreen } from "./types/GameScreen";
import Item from "./types/Item";
import { matchAll, Predicate } from "./types/logic";
import World, { WorldCell } from "./types/World";
import XY from "./types/XY";

export interface SerializedEngine {
  name: string;
  facing: Dir;
  inventory: string[];
  maps: Record<string, MapData>;
  obstacle?: XYTag;
  party: SerializedPlayer[];
  pendingArenaEnemies: EnemyName[];
  pendingNormalEnemies: EnemyName[];
  position: XYTag;
  worldLocation: WorldLocation;
}

export interface MapData {
  cells: XYTag[];
  overlays: Record<XYTag, WorldCell>;
  script: ScriptData;
  walls: Record<WallTag, WallTypeCondensed>;
}

interface TargetPicking {
  pc: Player;
  action: CombatAction;
  possibilities: Combatant[];
}

interface WorldLocation {
  resourceID: string;
  region: number;
  floor: number;
}

export interface WallType {
  canSeeDoor: boolean;
  isSolid: boolean;
  canSeeWall: boolean;
}

export type WallTypeCondensed = `${"d" | ""}${"s" | ""}${"w" | ""}`;

const calculateEventName = {
  dr: "onCalculateDR",
  maxHP: "onCalculateMaxHP",
  maxSP: "onCalculateMaxSP",
  camaraderie: "onCalculateCamaraderie",
  determination: "onCalculateDetermination",
  spirit: "onCalculateSpirit",
} as const satisfies Record<BoostableStat, GameEventName>;

const swap = (from: Dir, to: Dir) => ({ from, to });

export default class Engine implements Game {
  combat: CombatManager;
  controls: Map<string, GameInput[]>;
  ctx: CanvasRenderingContext2D;
  drawSoon: Soon;
  eventHandlers: GameEventListeners;
  facing: Dir;
  inventory: Item[];
  jukebox: Jukebox;
  log: string[];
  map: MapDataManager;
  obstacle?: XY;
  party: Player[];
  pendingArenaEnemies: EnemyName[];
  pendingNormalEnemies: EnemyName[];
  position: XY;
  pickingTargets?: TargetPicking;
  res: ResourceManager;
  screen!: GameScreen;
  scripting: EngineInkScripting;
  sfx: Sounds;
  showLog: boolean;
  world?: World;
  worldLocation?: WorldLocation;
  worldSize: XY;
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
    this.scripting = new EngineInkScripting(this);
    this.log = [];
    this.showLog = false;
    this.combat = new CombatManager(this);
    this.map = new MapDataManager(this);
    this.inventory = [];
    this.pendingArenaEnemies = [];
    this.pendingNormalEnemies = [];
    this.party = [];
    this.jukebox = new Jukebox(this);
    this.sfx = new Sounds(this);
    this.useScreen(new SplashScreen(this));

    canvas.addEventListener("keyup", (e) => this.screen.onKey(e));

    const transform = (e: MouseEvent): XY =>
      xyi(e.offsetX / this.zoomRatio, e.offsetY / this.zoomRatio);

    canvas.addEventListener("mousemove", (e) => this.onMouseMove(transform(e)));
    canvas.addEventListener("click", (e) => this.onClick(transform(e)));
  }

  useScreen(screen: GameScreen) {
    this.screen = screen;
    this.draw();
  }

  getSpot(pos: XY) {
    for (const element of this.screen.spotElements) {
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
      case "Cancel":
        return this.cancel();
      case "OpenStats":
        return this.openStats();
    }
  }

  async loadWorld(
    worldLocation: WorldLocation,
    w: World,
    position?: XY,
    dir?: Dir
  ) {
    const world = clone(w);
    this.useScreen(new LoadingScreen(this));

    this.worldLocation = worldLocation;
    this.world = world;
    this.worldSize = xyi(world.cells[0].length, world.cells.length);
    this.position = position ?? w.start;
    this.facing = dir ?? w.facing;

    const combat = new CombatRenderer(this);
    const hud = new HUDRenderer(this);
    const log = new LogRenderer(this);

    const atlasPromises = w.atlases.map((a) => this.res.loadAtlas(a.json));
    const imagePromises = w.atlases.map((a) => this.res.loadImage(a.image));

    const atlases = await Promise.all(atlasPromises);
    const images = await Promise.all(imagePromises);
    await hud.acquireImages();

    const dungeon = new DungeonRenderer(this, atlases[0], images[0]);
    for (let i = 0; i < atlases.length; i++) {
      await dungeon.addAtlas(atlases[i].layers, images[i]);
      if (i > 1) dungeon.dungeon.layers.push(...atlases[i].layers);
    }

    this.map.enter(w.name);

    if (position) loadIntoArea(w.name);
    else {
      this.markVisited();
      startArea(w.name);
    }

    this.useScreen(new DungeonScreen(this, { combat, dungeon, hud, log }));
  }

  async loadGCMap(
    resourceID: string,
    region: number,
    floor: number,
    loadPosition?: XY,
    loadFacing?: Dir
  ) {
    this.useScreen(new LoadingScreen(this));

    const jsonUrl = getResourceURL(resourceID);
    const map = await this.res.loadGCMap(jsonUrl);
    const { atlases, cells, scripts, start, facing, name } =
      convertGridCartographerMap(map, region, floor, EnemyObjects);
    if (!atlases.length) throw new Error(`${jsonUrl} did not contain #ATLAS`);

    // TODO this will NOT work with multiple scripts
    for (const url of scripts) {
      const code = await this.res.loadScript(url);
      this.scripting.parseAndRun(code);
    }

    return this.loadWorld(
      { resourceID, region, floor },
      { name, atlases, cells, start, facing },
      loadPosition,
      loadFacing
    );
  }

  isVisited(x: number, y: number) {
    return this.map.isVisited({ x, y });
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
          replaced.object = enemy.object;
          return replaced;
        }
      }
    }

    return cell;
  }

  get currentCell() {
    return this.getCell(this.position.x, this.position.y);
  }

  findCellWithTag(tag: string) {
    if (!this.world) return;

    for (let y = 0; y < this.worldSize.y; y++) {
      for (let x = 0; x < this.worldSize.x; x++) {
        if (this.world.cells[y][x].tags.includes(tag)) return { x, y };
      }
    }
  }

  findCellsWithTag(tag: string) {
    if (!this.world) return [];

    const matches: XY[] = [];
    for (let y = 0; y < this.worldSize.y; y++) {
      for (let x = 0; x < this.worldSize.x; x++) {
        if (this.world.cells[y][x].tags.includes(tag)) matches.push({ x, y });
      }
    }

    return matches;
  }

  draw() {
    this.drawSoon.schedule();
  }

  render = () => {
    const { ctx, screen } = this;
    const { width, height } = this.canvas;

    if (!screen.doNotClear) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
    }

    screen.render();
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

    const destination = move(this.position, dir);
    if (this.obstacle && !sameXY(destination, this.obstacle)) return false;

    if (this.canMove(dir)) {
      const old = this.position;
      this.position = destination;
      this.markVisited();
      this.markNavigable(old, dir);
      this.draw();

      this.setObstacle(false);
      this.fire("onPartyMove", { from: old, to: this.position });
      this.scripting.onEnter(this.position);
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

  interact(index: Dir) {
    if (!this.party[index].alive) return false;
    if (this.combat.inCombat) return false;

    return this.scripting.onInteract(index);
  }

  markVisited() {
    const pos = this.position;
    const cell = this.getCell(pos.x, pos.y);

    if (!this.map.isVisited(pos) && cell) {
      this.map.visit(pos);

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

        this.map.setWall(pos, dir, data);
      }
    }
  }

  markNavigable(pos: XY, dir: Dir) {
    const data = this.map.getWall(pos, dir);
    if (data.isSolid) data.isSolid = false;
  }

  markUnnavigable(pos: XY, dir: Dir) {
    const data = this.map.getWall(pos, dir);

    if (!data.isSolid) {
      data.isSolid = true;
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
    return this.map.getWallCondensed({ x, y }, dir);
  }

  turn(clockwise: number) {
    // TODO move cursor with keys
    if (this.pickingTargets) return false;

    this.combat.index = 0;
    const old = this.facing;
    this.facing = rotate(old, clockwise);
    this.fire("onPartyTurn", { from: old, to: this.facing });
    this.draw();
    return true;
  }

  menuMove(mod: number) {
    // TODO move cursor with keys
    if (this.pickingTargets) return false;
    if (!this.combat.inCombat) return false;
    if (this.combat.side === "enemy") return false;

    const actions = this.party[this.facing].actions;
    const index = wrap(this.combat.index + mod, actions.length);
    this.combat.index = index;
    this.draw();
    return true;
  }

  canAct(who: Combatant, action: CombatAction) {
    if (action === endTurnAction) return true;

    if (!who.alive) return false;
    if (who.usedThisTurn.has(action.name)) return false;

    const e = this.fire("onCanAct", { who, action, cancel: false });
    if (e.cancel) return false;

    if (action.sp > who.sp) return false;

    return true;
  }

  menuChoose() {
    // TODO picking targets with keys
    if (this.pickingTargets) return false;
    if (!this.combat.inCombat) return false;
    if (this.combat.side === "enemy") return false;

    const pc = this.party[this.facing];
    const action = pc.actions[this.combat.index];
    if (!action) return false;

    if (!this.canAct(pc, action)) return false;

    const { possibilities, amount } = this.getTargetPossibilities(pc, action);
    if (!possibilities.length) {
      this.addToLog("No valid targets.");
      return false;
    }

    // TODO allow picking of enemy targets
    if (possibilities.length > amount && action.targets.type === "ally") {
      if (amount !== 1)
        throw new Error(`Don't know how to pick ${amount} targets`);

      this.pickingTargets = { pc, action, possibilities };
      this.addToLog("Choose target.");
      return true;
    }

    const targets = pickN(possibilities, amount);
    this.act(pc, action, targets);
    return true;
  }

  getPosition(who: Combatant) {
    return this.combat.getPosition(who);
  }

  getOpponent(me: Combatant, turn = 0) {
    const { dir: myDir, distance } = this.getPosition(me);
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
    const me = this.getPosition(c);

    if (offsets)
      filters.push((o) => {
        const them = this.getPosition(o);
        return offsets.includes(getDirOffset(me.dir, them.dir));
      });

    if (typeof distance === "number")
      filters.push((o) => {
        const them = this.getPosition(o);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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

    if (!e.cancel) {
      action.act({ g: this, targets, me, x });

      me.lastAction = action.name;
      if (action.name === "Attack") {
        me.attacksInARow++;
      } else me.attacksInARow = 0;
    }

    this.fire("onAfterAction", {
      attacker: me,
      action,
      targets,
      cancelled: e.cancel,
    });
    this.combat.checkOver();
  }

  endTurn() {
    this.combat.endTurn();
  }

  addEffect(makeEffect: (destroy: () => void) => GameEffect) {
    const effect = makeEffect(() => this.removeEffect(effect));

    this.combat.effects.push(effect);
    for (const name of GameEventNames) {
      const handler = effect[name];
      if (handler) {
        const bound = handler.bind(effect);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        effect[name] = bound;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.eventHandlers[name].add(bound);
      }
    }
  }

  removeEffect(effect: GameEffect) {
    removeItem(this.combat.effects, effect);

    for (const name of GameEventNames) {
      const handler = effect[name];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (handler) this.eventHandlers[name].delete(handler);
    }
  }

  getEffectsOn(who: Combatant) {
    return this.combat.effects.filter((e) => e.affects.includes(who));
  }

  removeEffectsFrom(effects: GameEffect[], who: Combatant) {
    for (const e of effects) {
      removeItem(e.affects, who);
      if (!e.affects.length) this.removeEffect(e);
    }
  }

  roll(who: Combatant, size = 10) {
    const value = random(size) + 1;
    return this.fire("onRoll", { who, size, value }).value;
  }

  applyStatModifiers(who: Combatant, stat: BoostableStat, value: number) {
    const event = calculateEventName[stat];
    const e = this.fire(event, { who, value, multiplier: 1 });

    return Math.max(0, Math.floor(e.value * e.multiplier));
  }

  makePermanentDuff(
    target: Combatant,
    stat: "camaraderie" | "determination" | "spirit",
    amount: number
  ) {
    const effect: GameEffect = {
      name: "Scorn",
      duration: Infinity,
      permanent: true,
      affects: [target],
    };

    function calc(this: GameEffect, e: GameEvents["onCalculateCamaraderie"]) {
      if (this.affects.includes(e.who)) e.value -= amount;
    }

    if (stat === "camaraderie") effect.onCalculateCamaraderie = calc;
    else if (stat === "determination") effect.onCalculateDetermination = calc;
    else if (stat === "spirit") effect.onCalculateSpirit = calc;

    return () => effect;
  }

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: AttackableStat,
    origin: "normal" | "magic"
  ) {
    let total = 0;

    for (const target of targets.filter((x) => x.alive)) {
      const damage = this.fire("onCalculateDamage", {
        attacker,
        target,
        amount,
        multiplier: 1,
        type,
        origin,
      });
      const calculated = damage.amount * damage.multiplier;

      const resist = type === "hp" && origin === "normal" ? target.dr : 0;

      const deal = Math.floor(calculated - resist);
      if (deal > 0) {
        total += deal;

        // make it a perma if it's a PC persistent stat
        if (
          target.isPC &&
          (type === "camaraderie" ||
            type === "determination" ||
            type === "spirit")
        )
          this.addEffect(this.makePermanentDuff(target, type, deal));
        else target[type] -= deal;
        this.draw();

        const message =
          type === "hp"
            ? `${target.name} takes ${deal} damage.`
            : `${target.name} loses ${deal} ${type}.`;
        this.addToLog(message);

        if (target.hp < 1) this.kill(target, attacker);
        else void this.sfx.play("woosh");

        this.fire("onAfterDamage", { attacker, target, amount, type, origin });
      } else {
        const message =
          type === "hp"
            ? `${target.name} ignores the blow.`
            : `${target.name} ignores the effect.`;
        this.addToLog(message);
      }
    }

    return total;
  }

  heal(healer: Combatant, targets: Combatant[], amount: number) {
    let play = false;

    for (const target of targets) {
      const newHP = Math.min(target.hp + amount, target.maxHP);
      const gain = newHP - target.hp;
      if (gain) {
        play = true;
        target.hp = newHP;
        this.draw();

        const message = `${target.name} heals for ${gain}.`;
        this.addToLog(message);
      }
    }

    if (play) void this.sfx.play("buff1");
  }

  kill(who: Combatant, attacker: Combatant) {
    who.hp = 0;
    this.addToLog(`${who.name} dies!`);
    this.fire("onKilled", { who, attacker });
  }

  partyRotate(dir: -1 | 1) {
    if (this.pickingTargets) return false;

    if (this.combat.inCombat) {
      const immobile = this.party.find((pc) => !pc.canMove);
      if (immobile) return false;

      for (const pc of this.party) pc.move();
    }

    if (dir === -1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const north = this.party.shift()!;
      this.party.push(north);
      this.fire("onPartySwap", {
        swaps: [
          swap(Dir.N, Dir.W),
          swap(Dir.E, Dir.N),
          swap(Dir.S, Dir.E),
          swap(Dir.W, Dir.S),
        ],
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const west = this.party.pop()!;
      this.party.unshift(west);
      this.fire("onPartySwap", {
        swaps: [
          swap(Dir.N, Dir.E),
          swap(Dir.E, Dir.S),
          swap(Dir.S, Dir.W),
          swap(Dir.W, Dir.N),
        ],
      });
    }

    // TODO: replace with return this.turn(rotate(this.facing, dir)) ?
    this.draw();
    return true;
  }

  partySwap(side: number) {
    if (this.pickingTargets) return false;

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
    this.fire("onPartySwap", {
      swaps: [swap(this.facing, dir), swap(dir, this.facing)],
    });

    // TODO: replace with return this.turn(side) ?
    this.draw();
    return true;
  }

  moveEnemy(from: Dir, to: Dir): void {
    const fromArray = this.combat.enemies[from];
    const toArray = this.combat.enemies[to];

    const enemy = fromArray.shift();
    if (enemy) {
      toArray.unshift(enemy);
      this.draw();
    }
  }

  pcClicked(dir: Dir) {
    if (this.pickingTargets) {
      const { pc, action, possibilities } = this.pickingTargets;
      const target = this.party[dir];
      if (possibilities.includes(target)) {
        this.pickingTargets = undefined;
        this.act(pc, action, [target]);
        return;
      }

      this.addToLog("Invalid target.");
      return;
    }

    if (this.facing !== dir) this.partySwap(dir - this.facing);
  }

  cancel() {
    if (this.pickingTargets) {
      this.pickingTargets = undefined;
      this.addToLog("Cancelled.");
      return true;
    }

    return false;
  }

  addToInventory(name: string) {
    const item = getItem(name);
    if (item) {
      this.inventory.push(item);
      return true;
    }
    return false;
  }

  partyIsDead(lastToDie: number) {
    this.useScreen(new DeathScreen(this, this.party[lastToDie]));
    partyDied();
  }

  setObstacle(obstacle: boolean) {
    this.obstacle = obstacle
      ? move(this.position, rotate(this.facing, 2))
      : undefined;
  }

  save(name: string): SerializedEngine {
    const {
      facing,
      inventory,
      map,
      obstacle,
      party,
      pendingArenaEnemies,
      pendingNormalEnemies,
      position,
      worldLocation,
    } = this;

    if (!worldLocation) throw new Error(`Tried to save when not in a game.`);

    const data = {
      name,
      facing,
      inventory: inventory.map((i) => i.name),
      maps: map.serialize(),
      obstacle: obstacle ? xyToTag(obstacle) : undefined,
      party: party.map((p) => p.serialize()),
      pendingArenaEnemies,
      pendingNormalEnemies,
      position: xyToTag(position),
      worldLocation,
    };

    saveGame();
    return data;
  }

  async load(save: unknown) {
    if (!validateEngine(save)) {
      console.warn(validateEngine.errors);
      return;
    }

    this.facing = save.facing;
    this.inventory = save.inventory
      .map((name) => getItem(name))
      .filter(isDefined);
    this.map.load(save.maps);
    this.obstacle = save.obstacle ? tagToXy(save.obstacle) : undefined;
    this.party = save.party.map((data) => Player.load(this, data));
    this.pendingArenaEnemies = save.pendingArenaEnemies;
    this.pendingNormalEnemies = save.pendingNormalEnemies;

    // stuff that isn't saved
    this.log = [];
    this.showLog = false;

    await this.loadGCMap(
      save.worldLocation.resourceID,
      save.worldLocation.region,
      save.worldLocation.floor,
      tagToXy(save.position),
      save.facing
    );

    this.draw();
  }

  openStats() {
    this.useScreen(new StatsScreen(this));
    return true;
  }
}
