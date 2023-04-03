import {
  RuntimeFunction,
  RuntimeValue,
  callFunction,
  num,
  run,
} from "./DScript/logic";
import { move, rotate } from "./tools/geometry";

import { AttackableStat } from "./types/Combatant";
import DScriptHost from "./DScript/host";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { Program } from "./DScript/ast";
import XY from "./types/XY";
import isStat from "./tools/combatants";
import random from "./tools/random";

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
      const cell = this.g.getCell(x, y);
      if (!cell) throw new Error(`Invalid cell: ${x},${y}`);
      return cell;
    };
    const getDir = (dir: number): Dir => {
      if (dir < 0 || dir > 3) throw new Error(`Invalid dir: ${dir}`);
      return dir;
    };
    const getPC = (index: number) => {
      if (index < 0 || index > 4) throw new Error(`Tried to get PC ${index}`);
      return this.g.party[index];
    };
    const getStat = (stat: string): AttackableStat => {
      if (!isStat(stat)) throw new Error(`Invalid stat: ${stat}`);
      return stat;
    };

    this.addNative(
      "damagePC",
      ["number", "string", "number"],
      undefined,
      (index: number, type: string, amount: number) => {
        const pc = getPC(index);
        const stat = getStat(type);
        this.g.applyDamage(pc, [pc], amount, stat);
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
      this.g.facing = dir;
      this.g.draw();
    });

    this.addNative("message", ["string"], undefined, (msg: string) =>
      this.g.addToLog(msg)
    );

    this.addNative("movePartyToTag", ["string"], undefined, (tag: string) => {
      const position = this.g.findCellWithTag(tag);
      if (position) {
        this.g.position = position;
        this.g.markVisited();
        this.g.draw();
      }
    });

    this.addNative(
      "skillCheck",
      ["string", "number"],
      "bool",
      (type: string, dc: number) => {
        const stat = getStat(type);

        this.env.set("pcIndex", num(this.g.facing, true));
        const pc = this.g.party[this.g.facing];

        const roll = this.g.roll(10) + pc[stat];
        return roll >= dc;
      }
    );

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
        const dir = getDir(d);
        const cell = getCell(x, y);
        const side = cell.sides[dir];

        if (side) {
          side.solid = false;
          const otherSide = move({ x, y }, dir);
          const other = getCell(otherSide.x, otherSide.y);
          const opposite = other.sides[rotate(dir, 2)];

          if (opposite) opposite.solid = false;
        }
      }
    );
  }

  run(program: Program) {
    return run(this, program);
  }

  runCallback(fn: RuntimeFunction, ...args: RuntimeValue[]) {
    this.env.set("partyX", num(this.g.position.x, true));
    this.env.set("partyY", num(this.g.position.y, true));
    this.env.set("partyDir", num(this.g.facing, true));

    if (fn._ === "function")
      return callFunction(this, fn, args.slice(0, fn.args.length));
    else return fn.value(...args);
  }

  onEnter(newPos: XY, oldPos: XY) {
    const tile = this.g.getCell(newPos.x, newPos.y);
    if (!tile) return;

    for (const tag of tile.tags) {
      const cb = this.onTagEnter.get(tag);
      if (cb) this.runCallback(cb, num(oldPos.x), num(oldPos.y));
    }
  }

  onInteract() {
    const tile = this.g.getCell(this.g.position.x, this.g.position.y);
    if (!tile) return false;

    let result = false;
    for (const tag of tile.tags) {
      const cb = this.onTagInteract.get(tag);
      if (cb) {
        this.runCallback(cb);
        result = true;
      }
    }

    return result;
  }
}
