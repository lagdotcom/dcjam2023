import {
  RuntimeFunction,
  RuntimeValue,
  callFunction,
  num,
  readOnly,
  run,
} from "./DScript/logic";

import DScriptHost from "./DScript/host";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { Program } from "./DScript/ast";
import XY from "./types/XY";

export default class EngineScripting extends DScriptHost {
  onTagEnter: Map<string, RuntimeFunction>;

  constructor(public g: Engine) {
    super();

    this.env.set("NORTH", readOnly(num(Dir.N)));
    this.env.set("EAST", readOnly(num(Dir.E)));
    this.env.set("SOUTH", readOnly(num(Dir.S)));
    this.env.set("WEST", readOnly(num(Dir.W)));

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
    this.env.set("partyX", readOnly(num(this.g.position.x)));
    this.env.set("partyY", readOnly(num(this.g.position.y)));
    this.env.set("partyDir", readOnly(num(this.g.facing)));

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
