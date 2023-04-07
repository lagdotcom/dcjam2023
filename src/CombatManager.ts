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
  enemyTurnTimeout?: ReturnType<typeof setTimeout>;
  enemyAnimationInterval?: ReturnType<typeof setInterval>;
  pendingRemoval: Enemy[];

  constructor(
    public g: Engine,
    public enemyInitialDelay = 3000,
    public enemyTurnDelay = 1000,
    public enemyFrameTime = 100
  ) {
    this.effects = [];
    this.resetEnemies();
    this.inCombat = false;
    this.index = 0;
    this.side = "player";
    this.pendingRemoval = [];

    g.eventHandlers.onKilled.add(({ who }) => this.onKilled(who));
    g.eventHandlers.onCombatOver.add(this.end);
    g.eventHandlers.onAfterAction.add(this.onAfterAction);
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

  get allEnemies(): Enemy[] {
    return [
      ...this.enemies[0],
      ...this.enemies[1],
      ...this.enemies[2],
      ...this.enemies[3],
    ];
  }

  begin(enemies: EnemyName[], type: "normal" | "arena") {
    for (const e of this.effects.slice())
      if (!e.permanent) this.g.removeEffect(e);

    // TODO arrange them more sensibly
    this.resetEnemies();
    for (const name of enemies) {
      const enemy = spawn(this.g, name);
      const dir = random(4) as Dir;
      this.enemies[dir].push(enemy);
    }

    for (const c of this.aliveCombatants) {
      c.usedThisTurn.clear();
      c.sp = Math.min(c.spirit, c.maxSP);
    }

    this.inCombat = true;
    this.side = "player";
    this.g.fire("onCombatBegin", { type });
    this.g.draw();

    this.enemyAnimationInterval = setInterval(
      this.animateEnemies,
      this.enemyFrameTime
    );
  }

  end = () => {
    this.resetEnemies();
    this.inCombat = false;
    this.g.draw();

    clearInterval(this.enemyAnimationInterval);
    this.enemyAnimationInterval = undefined;
  };

  getFromOffset(dir: Dir, offset: number): Enemy | undefined {
    return this.enemies[dir][offset - 1];
  }

  getPosition(c: Combatant) {
    if (c.isPC)
      return { dir: this.g.party.indexOf(c as Player) as Dir, distance: -1 };

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
      c.sp = Math.min(newSp, c.maxSP);
    }

    for (const e of this.effects.slice()) {
      if (--e.duration < 1) this.g.removeEffect(e);
    }

    if (this.side === "enemy")
      this.enemyTurnTimeout = setTimeout(
        this.enemyTick,
        this.enemyInitialDelay
      );
    this.g.draw();
  }

  enemyTick = () => {
    if (!this.inCombat) {
      this.enemyTurnTimeout = undefined;
      return;
    }

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
      this.enemyTurnTimeout = undefined;
      return this.endTurn();
    }

    const { enemy, action, amount, possibilities } = oneOf(moves);
    const targets = pickN(possibilities, amount);
    this.g.act(enemy, action, targets);

    this.enemyTurnTimeout = setTimeout(this.enemyTick, this.enemyTurnDelay);
  };

  onKilled = (c: Combatant) => {
    if (!c.isPC) this.pendingRemoval.push(c as Enemy);
    else {
      const alive = this.g.party.find((p) => p.alive);
      if (alive) return;

      const index = this.g.party.indexOf(c as Player);
      this.g.partyIsDead(index);
    }
  };

  onAfterAction = () => {
    for (const e of this.pendingRemoval) this.removeEnemy(e);
    this.pendingRemoval = [];
  };

  private removeEnemy(e: Enemy) {
    const { dir, distance } = this.getPosition(e);
    this.enemies[dir].splice(distance, 1);
    this.g.draw();
  }

  animateEnemies = () => {
    for (const e of this.allEnemies) {
      e.advanceAnimation(this.enemyFrameTime);
    }

    this.g.draw();
  };

  checkOver() {
    const alive = this.g.party.find((pc) => pc.alive);
    const winners = alive
      ? this.allEnemies.length === 0
        ? "party"
        : undefined
      : "enemies";

    if (winners) {
      if (alive) this.g.addToLog(`You have vanquished your foes.`);
      else this.g.addToLog(`You have failed.`);

      this.g.fire("onCombatOver", { winners });
      // TODO item drops
    }
  }
}
