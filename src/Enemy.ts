import {
  allEnemies,
  EnemyAnimation,
  EnemyName,
  EnemyTemplate,
} from "./enemies";
import Engine from "./Engine";
import { wrap } from "./tools/numbers";
import CombatAction from "./types/CombatAction";
import Combatant, { BoostableStat } from "./types/Combatant";
import {
  ActionName,
  CombatantName,
  HitPoints,
  Milliseconds,
  SkillPoints,
} from "./types/flavours";

export default class Enemy implements Combatant {
  isPC: false;
  animation: EnemyAnimation;
  frame: number;
  delay: Milliseconds;
  name: CombatantName;
  hp: HitPoints;
  sp: SkillPoints;
  baseMaxHP: HitPoints;
  baseMaxSP: SkillPoints;
  baseCamaraderie: number;
  baseDetermination: number;
  baseSpirit: number;
  baseDR: HitPoints;
  actions: CombatAction[];
  attacksInARow: number;
  usedThisTurn: Set<ActionName>;
  lastAction?: ActionName;

  constructor(
    public g: Engine,
    public template: EnemyTemplate,
  ) {
    this.isPC = false;
    this.animation = template.animation;
    this.frame = 0;
    this.delay = this.animation.delay;
    this.name = template.name;
    this.baseMaxHP = template.maxHP;
    this.baseMaxSP = template.maxSP;
    this.hp = this.maxHP;
    this.sp = this.maxSP;
    this.baseCamaraderie = template.camaraderie;
    this.baseDetermination = template.determination;
    this.baseSpirit = template.spirit;
    this.baseDR = template.dr;
    this.actions = template.actions;
    this.attacksInARow = 0;
    this.usedThisTurn = new Set();
  }

  get alive() {
    return this.hp > 0;
  }

  getStat(stat: BoostableStat, base: number): number {
    return this.g.applyStatModifiers(this, stat, base);
  }

  get maxHP() {
    return this.getStat("maxHP", this.baseMaxHP);
  }
  get maxSP() {
    return this.getStat("maxHP", this.baseMaxSP);
  }

  get dr() {
    return this.getStat("dr", this.baseDR);
  }

  get camaraderie() {
    return this.getStat("camaraderie", this.baseCamaraderie);
  }
  get determination() {
    return this.getStat("determination", this.baseDetermination);
  }
  get spirit() {
    return this.getStat("spirit", this.baseSpirit);
  }

  advanceAnimation(time: number) {
    this.delay -= time;
    if (this.delay < 0) {
      this.frame = wrap(this.frame + 1, this.animation.frames.length);
      this.delay += this.animation.delay;
    }
  }

  get object() {
    return this.animation.frames[this.frame];
  }
}

export function spawn(g: Engine, name: EnemyName) {
  return new Enemy(g, allEnemies[name]);
}
