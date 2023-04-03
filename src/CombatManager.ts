import { Enemy, EnemyName, spawn } from "./enemies";

import Combatant from "./types/Combatant";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { GameEffect } from "./types/Game";
import random from "./tools/random";

export default class CombatManager {
  effects: GameEffect[];
  enemies!: Record<Dir, Enemy[]>;
  inCombat: boolean;
  index: number;
  side: "player" | "enemy";

  constructor(public g: Engine) {
    this.effects = [];
    this.resetEnemies();
    this.inCombat = false;
    this.index = 0;
    this.side = "player";
  }

  resetEnemies() {
    this.enemies = { 0: [], 1: [], 2: [], 3: [] };
  }

  get aliveCombatants(): Combatant[] {
    return [
      ...this.g.party,
      ...this.enemies[0],
      ...this.enemies[1],
      ...this.enemies[2],
      ...this.enemies[3],
    ].filter((c) => c.alive);
  }

  get allEnemies(): Combatant[] {
    return [
      ...this.enemies[0],
      ...this.enemies[1],
      ...this.enemies[2],
      ...this.enemies[3],
    ];
  }

  begin(enemies: EnemyName[]) {
    // TODO arrange them more sensibly
    this.resetEnemies();
    for (const name of enemies) {
      const enemy = spawn(name);
      const dir = random(4) as Dir;
      this.enemies[dir].push(enemy);
    }

    for (const c of this.aliveCombatants) {
      c.sp = Math.min(c.spirit, c.maxSp);
    }

    this.inCombat = true;
    this.side = "player";
    this.g.draw();
  }

  end() {
    this.resetEnemies();
    this.inCombat = false;
    this.g.draw();
  }

  getFromOffset(dir: Dir, offset: number): Enemy | undefined {
    return this.enemies[dir][offset - 1];
  }

  getDir(c: Combatant): Dir {
    for (let dir = 0; dir < 4; dir++) {
      if (this.enemies[dir as Dir].includes(c as Enemy)) return dir;
    }

    throw new Error(`${c.name} not found in combat`);
  }

  endTurn() {
    for (const c of this.aliveCombatants) {
      const newSp = c.sp < c.spirit ? c.spirit : c.sp + 1;
      c.sp = Math.min(newSp, c.maxSp);
    }

    const removing: GameEffect[] = [];
    for (const e of this.effects) {
      if (--e.duration < 1) removing.push(e);
    }
    for (const e of removing) this.g.removeEffect(e);

    this.g.draw();
  }
}
