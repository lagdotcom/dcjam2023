import { Path } from "inkjs/engine/Path";
import { Story } from "inkjs/engine/Story";

import { EnemyName, isEnemyName } from "./enemies";
import Engine from "./Engine";
import { getItem } from "./items";
import DialogChoiceScreen from "./screens/DialogChoiceScreen";
import { isSoundName } from "./Sounds";
import isStat from "./tools/combatants";
import { move, rotate } from "./tools/geometry";
import { updateMap } from "./tools/overlays";
import { tagToXy, XYTag, xyToTag } from "./tools/xyTags";
import { AttackableStat } from "./types/Combatant";
import Dir from "./types/Dir";
import XY from "./types/XY";

interface KnotEntry {
  name: string;
  once?: boolean;
}

export type ScriptData = Record<string, unknown>;

export default class EngineInkScripting {
  onTagEnter: Map<string, KnotEntry>;
  onTagInteract: Map<string, KnotEntry>;
  active: Dir;
  afterFight?: string;
  running: boolean;
  skill: string;
  story!: Story;

  constructor(public g: Engine) {
    this.onTagEnter = new Map();
    this.onTagInteract = new Map();
    this.active = 0;
    this.running = false;
    this.skill = "NONE";

    g.eventHandlers.onCombatOver.add(({ winners }) => {
      if (winners === "party" && this.afterFight && g.currentCell) {
        const name = this.afterFight;
        this.afterFight = undefined;
        void this.executePath("AFTER_FIGHT", { name });
      }
    });
  }

  parseAndRun(source: string) {
    const program = new Story(source);
    this.run(program);
  }

  saveState(): ScriptData {
    return JSON.parse(this.story.state.toJson()) as ScriptData;
  }

  loadState(data: ScriptData) {
    this.story.state.LoadJsonObj(data);
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
      if (!position) console.warn(`Cannot find tag: ${tag}`);
      return position;
    };
    const getSide = (xy: XYTag, d: Dir) => {
      const dir = getDir(d);
      const cell = getCell(xy);
      const side = cell.sides[dir] ?? {};
      if (!cell.sides[dir]) cell.sides[dir] = side;

      return side;
    };
    const getSound = (name: string) => {
      if (!isSoundName(name)) throw new Error(`invalid sound name: ${name}`);
      return name;
    };

    program.BindExternalFunction("active", () => this.active, true);
    program.BindExternalFunction("addArenaEnemy", (name: string) => {
      const enemy = getEnemy(name);
      this.g.pendingArenaEnemies.push(enemy);
    });
    program.BindExternalFunction("addTag", (xy: XYTag, value: string) =>
      updateMap(this.g, { type: "addTag", xy, value }),
    );
    program.BindExternalFunction(
      "damagePC",
      (index: number, type: string, amount: number) => {
        const pc = getPC(index);
        const stat = getStat(type);
        this.g.applyDamage(pc, [pc], amount, stat, "normal");
      },
    );
    program.BindExternalFunction("facing", () => this.g.facing, true);
    program.BindExternalFunction(
      "forEachTaggedTile",
      (tag: string, callback: Path) => {
        for (const pos of this.g.findCellsWithTag(tag))
          this.story.EvaluateFunction(callback.componentsString, [
            xyToTag(pos),
          ]);
      },
    );
    program.BindExternalFunction(
      "getDecal",
      (xy: XYTag, dir: Dir) => getSide(xy, dir).decal ?? 0,
      true,
    );
    program.BindExternalFunction(
      "getNumber",
      (name: string) => this.g.currentCell?.numbers[name] ?? 0,
      true,
    );
    program.BindExternalFunction(
      "getString",
      (name: string) => this.g.currentCell?.strings[name] ?? "",
      true,
    );
    program.BindExternalFunction(
      "getTagPosition",
      (tag: string) => xyToTag(getPositionByTag(tag)),
      true,
    );
    program.BindExternalFunction("giveItem", (name: string) => {
      const item = getItem(name);
      if (item) this.g.inventory.push(item);
    });
    program.BindExternalFunction("here", () => xyToTag(this.g.position), true);
    program.BindExternalFunction(
      "isArenaFightPending",
      () => this.g.pendingArenaEnemies.length > 0,
      true,
    );
    program.BindExternalFunction(
      "move",
      (xy: XYTag, dir: Dir) => xyToTag(move(tagToXy(xy), dir)),
      true,
    );
    program.BindExternalFunction(
      "name",
      (dir: Dir) => this.g.party[dir].name,
      true,
    );
    program.BindExternalFunction("playSound", (name: string) => {
      const sound = getSound(name);
      void this.g.sfx.play(sound);
    });
    program.BindExternalFunction("removeObject", (xy: XYTag) =>
      updateMap(this.g, { type: "removeObject", xy }),
    );
    program.BindExternalFunction("removeTag", (xy: XYTag, value: string) =>
      updateMap(this.g, { type: "removeTag", xy, value }),
    );
    program.BindExternalFunction(
      "rotate",
      (dir: Dir, quarters: number) => rotate(dir, quarters),
      true,
    );
    program.BindExternalFunction(
      "setDecal",
      (xy: XYTag, dir: Dir, value: number) =>
        updateMap(this.g, { type: "setDecal", xy, dir: getDir(dir), value }),
    );
    program.BindExternalFunction("setObstacle", (blocked: boolean) =>
      this.g.setObstacle(blocked),
    );
    program.BindExternalFunction(
      "setSolid",
      (xy: XYTag, dir: Dir, value: boolean) =>
        updateMap(this.g, { type: "setSolid", xy, dir: getDir(dir), value }),
    );
    program.BindExternalFunction("skill", () => this.skill, true);
    program.BindExternalFunction("skillCheck", (type: string, dc: number) => {
      const stat = getStat(type);
      const pc = this.g.party[this.active];
      const roll = this.g.roll(pc) + pc[stat];
      return roll >= dc;
    });
    program.BindExternalFunction("startArenaFight", (afterFight: string) => {
      const count = this.g.pendingArenaEnemies.length;
      if (!count) return false;

      const enemies = this.g.pendingArenaEnemies.splice(0, count);
      if (afterFight) this.afterFight = afterFight;
      this.g.combat.begin(enemies, "arena");
      return true;
    });
    program.BindExternalFunction("teleportParty", (xy: XYTag, dir: Dir) =>
      this.g.teleport(tagToXy(xy), dir),
    );

    program.ContinueMaximally();
    for (const [name] of program.mainContentContainer.namedContent) {
      const entry: KnotEntry = { name };
      const tags = program.TagsForContentAtPath(name) ?? [];

      for (const tag of tags) {
        const [left, right] = tag.split(":");

        if (left === "enter") this.onTagEnter.set(right.trim(), entry);
        else if (left === "interact")
          this.onTagInteract.set(right.trim(), entry);
        else if (left === "once") entry.once = true;
        else throw new Error(`Unknown knot tag: ${left}`);
      }
    }
  }

  async onEnter(pos: XY) {
    const cell = this.g.getCell(pos.x, pos.y);
    if (!cell) return;

    this.active = this.g.facing;
    for (const tag of cell.tags) {
      const entry = this.onTagEnter.get(tag);
      if (entry) await this.executePath(tag, entry);
    }
  }

  hasInteraction() {
    const cell = this.g.currentCell;
    if (!cell) return false;

    for (const tag of cell.tags) {
      const entry = this.onTagInteract.get(tag);
      if (entry) return true;
    }

    return false;
  }

  async onInteract(pcIndex: number) {
    const cell = this.g.currentCell;
    if (!cell) return;

    this.active = pcIndex;
    this.skill = this.g.party[pcIndex].skill;
    for (const tag of cell.tags) {
      const entry = this.onTagInteract.get(tag);
      if (entry) await this.executePath(tag, entry);
    }
  }

  private async executePath(value: string, entry: KnotEntry) {
    this.story.ChoosePathString(entry.name);
    if (entry.once)
      updateMap(this.g, {
        type: "removeTag",
        xy: xyToTag(this.g.position),
        value,
      });

    return new Promise<void>((resolve) => {
      void this.runUntilDone().then(resolve);
    });
  }

  private async runUntilDone() {
    this.running = true;
    while (this.story.canContinue) {
      const result = this.story.Continue();

      // TODO could use tags etc.

      if (this.story.currentChoices.length) {
        const screen = new DialogChoiceScreen(
          this.g,
          result || "",
          // TODO could use tags etc.
          this.story.currentChoices,
        );
        this.g.useScreen(screen);

        // TODO default choice on timeout

        const choice = await screen.run();
        this.story.ChooseChoiceIndex(choice.index);
      }

      if (result) this.g.addToLog(result);
    }

    this.running = false;
  }
}
