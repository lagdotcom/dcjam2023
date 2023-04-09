import { EnemyName, isEnemyName } from "./enemies";
import { XYTag, tagToXy, xyToTag } from "./tools/xyTags";
import { move, rotate } from "./tools/geometry";

import { AttackableStat } from "./types/Combatant";
import { Compiler } from "inkjs";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { Story } from "inkjs/engine/Story";
import XY from "./types/XY";
import { getItem } from "./items";
import { isSoundName } from "./Sounds";
import isStat from "./tools/combatants";

export default class EngineInkScripting {
  onTagEnter: Map<string, string>;
  onTagInteract: Map<string, string>;
  active: Dir;
  skill: string;
  story: Story;

  constructor(public g: Engine) {
    this.onTagEnter = new Map();
    this.onTagInteract = new Map();
  }

  parseAndRun(source: string, filename: string) {
    const compiler = new Compiler(source, {
      sourceFilename: filename,
      errorHandler: (msg, type) => {
        console.log(msg, type);
      },
      pluginNames: [],
      countAllVisits: false,
      fileHandler: {
        LoadInkFileContents(filename) {
          console.log("LoadInkFileContents", filename);
        },
        ResolveInkFilename(filename) {
          return filename;
        },
      },
    });

    const program = compiler.Compile();
    this.run(program);
  }

  run(program: Story) {
    this.onTagEnter.clear();
    this.onTagInteract.clear();
    this.story = program;

    const getCell = (xy: XYTag) => {
      const pos = tagToXy(xy);
      const cell = this.g.getCell(pos.x, pos.y);
      if (!cell) throw new Error(`Invalid cell: ${xy}`);
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
    const getEnemy = (name: string): EnemyName => {
      if (!isEnemyName(name)) throw new Error(`Invalid enemy: ${name}`);
      return name;
    };
    const getPositionByTag = (tag: string) => {
      const position = this.g.findCellWithTag(tag);
      if (!position) throw new Error(`Cannot find tag: ${tag}`);
      return position;
    };
    const getSide = (xy: XYTag, d: Dir) => {
      const dir = getDir(d);
      const cell = getCell(xy);
      const side = cell.sides[dir];
      if (!side)
        throw new Error(
          `script tried to unlock ${xy},${d} -- side does not exist`
        );

      return side;
    };
    const getSound = (name: string) => {
      if (!isSoundName(name)) throw new Error(`invalid sound name: ${name}`);
      return name;
    };

    program.BindExternalFunction("active", () => this.active);
    program.BindExternalFunction(
      "damagePC",
      (index: number, type: string, amount: number) => {
        const pc = getPC(index);
        const stat = getStat(type);
        this.g.applyDamage(pc, [pc], amount, stat, "normal");
      }
    );
    program.BindExternalFunction("facing", () => this.g.facing);
    program.BindExternalFunction(
      "getNumber",
      (name: string) => this.g.currentCell?.numbers[name] ?? 0
    );
    program.BindExternalFunction(
      "getString",
      (name: string) => this.g.currentCell?.strings[name] ?? ""
    );
    program.BindExternalFunction("getTagPosition", (tag: string) =>
      xyToTag(this.g.findCellWithTag(tag))
    );
    program.BindExternalFunction("giveItem", (name: string) => {
      const item = getItem(name);
      if (item) this.g.inventory.push(item);
    });
    program.BindExternalFunction("here", () => xyToTag(this.g.position));
    program.BindExternalFunction("move", (xy: XYTag, dir: Dir) =>
      xyToTag(move(tagToXy(xy), dir))
    );
    program.BindExternalFunction("name", (dir: Dir) => this.g.party[dir].name);
    program.BindExternalFunction("playSound", (name: string) => {
      const sound = getSound(name);
      void this.g.sfx.play(sound);
    });
    program.BindExternalFunction("removeObject", (xy: XYTag) => {
      const cell = getCell(xy);
      cell.object = undefined;
    });
    program.BindExternalFunction("removeTag", (xy: XYTag, tag: string) => {
      const cell = getCell(xy);
      const index = cell.tags.indexOf(tag);
      if (index >= 0) cell.tags.splice(index, 1);
      else
        console.warn(
          `script tried to remove tag ${tag} at ${xy} -- not present`
        );
    });
    program.BindExternalFunction("rotate", (dir: Dir, quarters: number) =>
      rotate(dir, quarters)
    );
    program.BindExternalFunction(
      "setDecal",
      (xy: XYTag, dir: Dir, decal: number) => {
        const side = getSide(xy, dir);
        side.decal = decal;
      }
    );
    program.BindExternalFunction("setObstacle", (blocked: boolean) =>
      this.g.setObstacle(blocked)
    );
    program.BindExternalFunction(
      "setSolid",
      (xy: XYTag, dir: Dir, solid: boolean) => {
        const side = getSide(xy, dir);
        side.solid = solid;
      }
    );
    program.BindExternalFunction("skill", () => this.skill);
    program.BindExternalFunction("skillCheck", (type: string, dc: number) => {
      const stat = getStat(type);
      const pc = this.g.party[this.active];
      const roll = this.g.roll(pc) + pc[stat];
      return roll >= dc;
    });

    program.ContinueMaximally();
    for (const [name] of program.mainContentContainer.namedContent) {
      const tags = program.TagsForContentAtPath(name) ?? [];

      for (const tag of tags) {
        const [left, right] = tag.split(":");

        if (left === "enter") this.onTagEnter.set(right.trim(), name);
        else if (left === "interact")
          this.onTagInteract.set(right.trim(), name);
      }
    }
  }

  setConstant(key, value) {}

  onEnter(pos: XY, old: XY) {
    this.active = this.g.facing;
    const cell = this.g.getCell(pos.x, pos.y);
    for (const tag of cell?.tags ?? []) {
      const path = this.onTagEnter.get(tag);
      if (path) {
        this.story.ChoosePathString(path);
        const result = this.story.ContinueMaximally();
        if (result) this.g.addToLog(result);
      }
    }
  }

  onInteract(pcIndex: number) {
    this.active = pcIndex;
    this.skill = this.g.party[pcIndex].skill;
    for (const tag of this.g.currentCell?.tags ?? []) {
      const path = this.onTagInteract.get(tag);
      if (path) {
        this.story.ChoosePathString(path);
        const result = this.story.ContinueMaximally();
        if (result) this.g.addToLog(result);
      }
    }
  }
}
