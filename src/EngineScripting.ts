import {
  RuntimeFunction,
  RuntimeValue,
  callFunction,
  num,
  run,
  str,
} from "./DScript/logic";
import { move, rotate } from "./tools/geometry";

import { AttackableStat } from "./types/Combatant";
import DScriptHost from "./DScript/host";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { LiteralNumber, Program } from "./DScript/ast";
import XY from "./types/XY";
import isStat from "./tools/combatants";
import { random } from "./tools/rng";
import { EnemyName, isEnemyName } from "./enemies";

export default class EngineScripting extends DScriptHost {
  onTagEnter: Map<string, RuntimeFunction>;
  onTagInteract: Map<string, RuntimeFunction>;

  constructor(public g: Engine) {
    super();

    this.env.set("NORTH", num(Dir.N, true));
    this.env.set("EAST", num(Dir.E, true));
    this.env.set("SOUTH", num(Dir.S, true));
    this.env.set("WEST", num(Dir.W, true));

    this.onTagEnter = new Map();
    this.onTagInteract = new Map();

    const getCell = (x: number, y: number) => {
      const cell = g.getCell(x, y);
      if (!cell) throw new Error(`Invalid cell: ${x},${y}`);
      return cell;
    };
    const getDir = (dir: number): Dir => {
      if (dir < 0 || dir > 3) throw new Error(`Invalid dir: ${dir}`);
      return dir;
    };
    const getPC = (index: number) => {
      if (index < 0 || index > 4) throw new Error(`Tried to get PC ${index}`);
      return g.party[index];
    };
    const getStat = (stat: string): AttackableStat => {
      if (!isStat(stat)) throw new Error(`Invalid stat: ${stat}`);
      return stat;
    };
    const getEnemy = (name: string): EnemyName => {
      if (!isEnemyName(name)) throw new Error(`Invalid enemy: ${name}`);
      return name;
    };
    const getThisCell = () => getCell(g.position.x, g.position.y);
    const getPositionByTag = (tag: string) => {
      const position = g.findCellWithTag(tag);
      if (!position) throw new Error(`Cannot find tag: ${tag}`);
      return position;
    };
    const getSide = (x: number, y: number, d: Dir) => {
      const dir = getDir(d);
      const cell = getCell(x, y);
      const side = cell.sides[dir];
      if (!side)
        throw new Error(
          `script tried to unlock ${x},${y},${d} -- side does not exist`
        );

      return side;
    };

    this.addNative("addArenaEnemy", ["string"], undefined, (name: string) => {
      const enemy = getEnemy(name);
      g.pendingArenaEnemies.push(enemy);
    });

    this.addNative("addNormalEnemy", ["string"], undefined, (name: string) => {
      const enemy = getEnemy(name);
      g.pendingNormalEnemies.push(enemy);
    });

    this.addNative(
      "damagePC",
      ["number", "string", "number"],
      undefined,
      (index: number, type: string, amount: number) => {
        const pc = getPC(index);
        const stat = getStat(type);
        g.applyDamage(pc, [pc], amount, stat, "normal");
      }
    );

    this.addNative("debug", ["any"], undefined, (thing: unknown) =>
      console.log("[debug]", thing)
    );

    this.addNative(
      "getPCName",
      ["number"],
      "string",
      (index: number) => getPC(index).name
    );

    this.addNative("getNumber", ["string"], "number", (key: string) => {
      const cell = getThisCell();
      if (!(key in cell.numbers))
        throw new Error(
          `Tried to get non-existant #NUMBER ${key} at ${g.position.x},${g.position.y}`
        );
      return cell.numbers[key];
    });
    this.addNative("getString", ["string"], "string", (key: string) => {
      const cell = getThisCell();
      if (!(key in cell.strings))
        throw new Error(
          `Tried to get non-existant #STRING ${key} at ${g.position.x},${g.position.y}`
        );
      return cell.strings[key];
    });

    this.addNative("giveItem", ["string"], undefined, (name: string) => {
      if (!g.addToInventory(name)) throw new Error(`Invalid item: ${name}`);
    });

    this.addNative(
      "isArenaFightPending",
      [],
      "bool",
      () => g.pendingArenaEnemies.length > 0
    );

    this.addNative(
      "isSolid",
      ["number", "number", "number"],
      "bool",
      (x: number, y: number, d: number) => {
        const dir = getDir(d);
        const cell = getCell(x, y);

        return cell.sides[dir]?.solid ?? false;
      }
    );

    this.addNative("makePartyFace", ["number"], undefined, (d: number) => {
      const dir = getDir(d);
      g.facing = dir;
      g.draw();
    });

    this.addNative("message", ["string"], undefined, (msg: string) =>
      g.addToLog(msg)
    );

    this.addNative("movePartyToTag", ["string"], undefined, (tag: string) => {
      const position = getPositionByTag(tag);
      g.position = position;
      g.markVisited();
      g.draw();
    });

    this.addNative(
      "skillCheck",
      ["string", "number"],
      "bool",
      (type: string, dc: number) => {
        const stat = getStat(type);
        const pcIndex = (this.env.get("pcIndex") as LiteralNumber).value;
        const pc = g.party[pcIndex];

        const roll = g.roll(pc) + pc[stat];
        return roll >= dc;
      }
    );

    this.addNative("startArenaFight", [], "bool", () => {
      const count = g.pendingArenaEnemies.length;
      if (!count) return false;

      const enemies = g.pendingArenaEnemies.splice(0, count);
      g.combat.begin(enemies, "arena");
      return true;
    });

    this.addNative("startNormalFight", [], "bool", () => {
      const count = g.pendingNormalEnemies.length;
      if (!count) return false;

      const enemies = g.pendingNormalEnemies.splice(0, count);
      g.combat.begin(enemies, "normal");
      return true;
    });

    this.addNative(
      "onTagInteract",
      ["string", "function"],
      undefined,
      (tag: string, cb: RuntimeFunction) => {
        this.onTagInteract.set(tag, cb);
      }
    );

    this.addNative(
      "onTagEnter",
      ["string", "function"],
      undefined,
      (tag: string, cb: RuntimeFunction) => {
        this.onTagEnter.set(tag, cb);
      }
    );

    this.addNative("random", ["number"], "number", random);

    this.addNative(
      "removeObject",
      ["number", "number"],
      undefined,
      (x: number, y: number) => {
        const cell = getCell(x, y);
        cell.object = undefined;
        g.draw();
      }
    );

    this.addNative(
      "removeTag",
      ["number", "number", "string"],
      undefined,
      (x: number, y: number, tag: string) => {
        const cell = getCell(x, y);
        const index = cell.tags.indexOf(tag);
        if (index >= 0) cell.tags.splice(index, 1);
        else
          console.warn(
            `script tried to remove tag ${tag} at ${x},${y} -- not present`
          );
      }
    );

    this.addNative(
      "selectTileWithTag",
      ["string"],
      undefined,
      (tag: string) => {
        const position = getPositionByTag(tag);
        this.env.set("selectedX", num(position.x, true));
        this.env.set("selectedY", num(position.y, true));
      }
    );

    this.addNative(
      "setDecal",
      ["number", "number", "number", "number"],
      undefined,
      (x: number, y: number, d: number, t: number) => {
        const side = getSide(x, y, d);
        side.decal = t;
        g.draw();
      }
    );

    this.addNative(
      "setSolid",
      ["number", "number", "number", "bool"],
      undefined,
      (x: number, y: number, d: number, solid: boolean) => {
        const side = getSide(x, y, d);
        side.solid = solid;
      }
    );

    this.addNative(
      "tileHasTag",
      ["number", "number", "string"],
      "bool",
      (x: number, y: number, tag: string) => getCell(x, y).tags.includes(tag)
    );

    this.addNative(
      "unlock",
      ["number", "number", "number"],
      undefined,
      (x: number, y: number, d: number) => {
        const side = getSide(x, y, d);
        side.solid = false;

        const otherSide = move({ x, y }, d);
        const opposite = getSide(otherSide.x, otherSide.y, rotate(d, 2));
        if (opposite) opposite.solid = false;
      }
    );

    this.addNative("obstacle", [], undefined, () => g.setObstacle(true));
    this.addNative("clearObstacle", [], undefined, () => g.setObstacle(false));
  }

  run(program: Program) {
    return run(this, program);
  }

  runCallback(fn: RuntimeFunction, ...args: RuntimeValue[]) {
    this.env.set("partyX", num(this.g.position.x, true));
    this.env.set("partyY", num(this.g.position.y, true));
    this.env.set("partyDir", num(this.g.facing, true));
    this.env.delete("selectedX");
    this.env.delete("selectedY");

    if (fn._ === "function")
      return callFunction(this, fn, args.slice(0, fn.args.length));
    else return fn.value(...args);
  }

  onEnter(newPos: XY, oldPos: XY) {
    const tile = this.g.getCell(newPos.x, newPos.y);
    if (!tile) return;

    for (const tag of tile.tags) {
      const cb = this.onTagEnter.get(tag);
      if (cb) {
        this.env.set("pcIndex", num(this.g.facing, true));
        this.runCallback(cb, num(oldPos.x), num(oldPos.y));
      }
    }
  }

  onInteract(pcIndex: number) {
    const tile = this.g.getCell(this.g.position.x, this.g.position.y);
    if (!tile) return false;

    let result = false;
    for (const tag of tile.tags) {
      const cb = this.onTagInteract.get(tag);
      if (cb) {
        this.env.set("pcIndex", num(pcIndex, true));
        this.runCallback(cb, str(this.g.party[pcIndex].skill));
        result = true;
      }
    }

    return result;
  }
}
