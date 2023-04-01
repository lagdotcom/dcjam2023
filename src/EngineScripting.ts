import {
  RuntimeFunction,
  RuntimeValue,
  callFunction,
  num,
  run,
} from "./DScript/logic";

import DScriptHost from "./DScript/host";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { Program } from "./DScript/ast";
import XY from "./types/XY";
import random from "./tools/random";

export default class EngineScripting extends DScriptHost {
  onTagEnter: Map<string, RuntimeFunction>;

  constructor(public g: Engine) {
    super();

    this.env.set("NORTH", num(Dir.N, true));
    this.env.set("EAST", num(Dir.E, true));
    this.env.set("SOUTH", num(Dir.S, true));
    this.env.set("WEST", num(Dir.W, true));

    this.onTagEnter = new Map();

    this.addNative("debug", ["any"], undefined, (thing: unknown) =>
      console.log("[debug]", thing)
    );

    this.addNative("makePartyFace", ["number"], undefined, (dir: number) => {
      if (dir < Dir.N || dir > Dir.W)
        throw new Error(`Tried to face direction: ${dir}`);
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
      (x: number, y: number, tag: string) => {
        const cell = this.g.getCell(x, y);
        return cell?.tags.includes(tag);
      }
    );
  }

  run(program: Program) {
    this.env.set("partyX", num(this.g.position.x, true));
    this.env.set("partyY", num(this.g.position.y, true));
    this.env.set("partyDir", num(this.g.facing, true));

    return run(this, program);
  }

  runCallback(fn: RuntimeFunction, ...args: RuntimeValue[]) {
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
}
