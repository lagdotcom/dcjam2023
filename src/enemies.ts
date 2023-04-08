import CombatAction from "./types/CombatAction";

import Combatant, { BoostableStat } from "./types/Combatant";
import {
  generateAttack,
  Defy,
  Bless,
  oneOpponent,
  Deflect,
  Scar,
  Barb,
  Parry,
  Flight,
  Bravery,
  Sand,
  Trick,
} from "./actions";
import Engine from "./Engine";
import { wrap } from "./tools/numbers";

export interface EnemyAnimation {
  delay: number;
  frames: number[];
}

type EnemyTemplate = Pick<
  Combatant,
  "name" | "maxHP" | "maxSP" | "camaraderie" | "determination" | "spirit" | "dr"
> & { actions: CombatAction[]; object: number; animation: EnemyAnimation };

const Lash: CombatAction = {
  name: "Lash",
  tags: ["attack", "duff"],
  sp: 3,
  targets: oneOpponent,
  act({ g, me, targets }) {
    if (g.applyDamage(me, targets, 3, "hp", "normal") > 0) {
      g.addEffect(() => ({
        name: "Lash",
        duration: 2,
        affects: targets,
        onCalculateDetermination(e) {
          if (this.affects.includes(e.who)) e.value--;
        },
      }));
    }
  },
};

export const EnemyObjects = {
  eNettleSage: 100,
  eEveScout: 110,
  eSneedCrawler: 120,
  eMullanginanMartialist: 130,
  oNettleSage: 100,
  oEveScout: 110,
  oSneedCrawler: 120,
  oMullanginanMartialist: 130,
} as const;

const enemies = {
  "Eve Scout": {
    object: EnemyObjects.eEveScout,
    animation: { delay: 300, frames: [110, 111, 112, 113] },
    name: "Eve Scout",
    maxHP: 10,
    maxSP: 5,
    camaraderie: 3,
    determination: 3,
    spirit: 4,
    dr: 0,
    actions: [generateAttack(0, 1), Deflect, Sand, Trick],
  },
  "Sneed Crawler": {
    object: EnemyObjects.eSneedCrawler,
    animation: { delay: 300, frames: [120, 121, 122, 123, 124, 125] },
    name: "Sneed Crawler",
    maxHP: 13,
    maxSP: 4,
    camaraderie: 1,
    determination: 5,
    spirit: 4,
    dr: 0,
    actions: [generateAttack(0, 1), Scar, Barb],
  },
  "Mullanginan Martialist": {
    object: EnemyObjects.eMullanginanMartialist,
    animation: { delay: 300, frames: [130, 131, 130, 132] },
    name: "Mullanginan Martialist",
    maxHP: 14,
    maxSP: 4,
    camaraderie: 3,
    determination: 4,
    spirit: 4,
    dr: 0,
    actions: [generateAttack(0, 1), Parry, Defy, Flight],
  },
  "Nettle Sage": {
    object: EnemyObjects.eNettleSage,
    animation: { delay: 300, frames: [100, 101, 100, 102] },
    name: "Nettle Sage",
    maxHP: 12,
    maxSP: 7,
    camaraderie: 2,
    determination: 2,
    spirit: 6,
    dr: 0,
    actions: [generateAttack(0, 1), Bravery, Bless, Lash],
  },
} satisfies Record<string, EnemyTemplate>;
export type EnemyName = keyof typeof enemies;
const EnemyNames = Object.keys(enemies);

export function isEnemyName(name: string): name is EnemyName {
  return EnemyNames.includes(name);
}

export class Enemy implements Combatant {
  isPC: false;
  animation: EnemyAnimation;
  frame: number;
  delay: number;
  name: string;
  hp: number;
  sp: number;
  baseMaxHP: number;
  baseMaxSP: number;
  baseCamaraderie: number;
  baseDetermination: number;
  baseSpirit: number;
  baseDR: number;
  actions: CombatAction[];
  attacksInARow: number;
  usedThisTurn: Set<string>;
  lastAction?: string;

  constructor(public g: Engine, public template: EnemyTemplate) {
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
  return new Enemy(g, enemies[name]);
}
