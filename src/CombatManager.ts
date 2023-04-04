import { Enemy, EnemyName, spawn } from "./enemies";

import Combatant from "./types/Combatant";
import Dir from "./types/Dir";
import Engine from "./Engine";
import { GameEffect } from "./types/Game";
import { oneOf, pickN, random } from "./tools/rng";
import Player from "./Player";
import isDefined from "./tools/isDefined";

export default class CombatManager {
  effects: GameEffect[];
  enemies!: Record<Dir, Enemy[]>;
  inCombat: boolean;
  index: number;
  side: "player" | "enemy";
  timeout?: ReturnType<typeof setTimeout>;

  constructor(
    public g: Engine,
    public enemyInitialDelay = 3000,
    public enemyTurnDelay = 1000
  ) {
    this.effects = [];
    this.resetEnemies();
    this.inCombat = false;
    this.index = 0;
    this.side = "player";

    g.eventHandlers.onKilled.add(({ who }) => this.onKilled(who));
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
      c.usedThisTurn.clear();
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

  getPosition(c: Combatant) {
    if (c.isPC)
      return { dir: this.g.party.indexOf(c as Player) as Dir, distance: NaN };

    for (let dir = 0; dir < 4; dir++) {
      const distance = this.enemies[dir as Dir].indexOf(c as Enemy);
      if (distance >= 0) return { dir: dir as Dir, distance };
    }

    throw new Error(`${c.name} not found in combat`);
  }

  endTurn() {
    this.side = this.side === "player" ? "enemy" : "player";

    const combatants = this.side === "player" ? this.g.party : this.allEnemies;
    for (const c of combatants) {
      c.usedThisTurn.clear();
      if (!c.alive) continue;

      const newSp = c.sp < c.spirit ? c.spirit : c.sp + 1;
      c.sp = Math.min(newSp, c.maxSp);
    }

    for (const e of this.effects.slice()) {
      if (--e.duration < 1) this.g.removeEffect(e);
    }

    if (this.side === "enemy")
      this.timeout = setTimeout(this.enemyTick, this.enemyInitialDelay);
    this.g.draw();
  }

  enemyTick = () => {
    const moves = this.allEnemies.flatMap((enemy) =>
      enemy.actions
        .map((action) => {
          if (!this.g.canAct(enemy, action)) return;

          const { amount, possibilities } = this.g.getTargetPossibilities(
            enemy,
            action
          );

          if (possibilities.length)
            return { enemy, action, amount, possibilities };
        })
        .filter(isDefined)
    );
    if (!moves.length) {
      this.timeout = undefined;
      return this.endTurn();
    }

    const { enemy, action, amount, possibilities } = oneOf(moves);
    const targets = pickN(possibilities, amount);
    this.g.act(enemy, action, targets);

    this.timeout = setTimeout(this.enemyTick, this.enemyTurnDelay);
  };

  onKilled = (c: Combatant) => {
    if (!c.isPC) {
      const { dir, distance } = this.getPosition(c);
      this.enemies[dir].splice(distance, 1);
      this.g.draw();
    }
  };
}
