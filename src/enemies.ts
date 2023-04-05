import Item, { ItemSlot } from "./types/Item";
import CombatAction from "./types/CombatAction";

import Combatant, { BoostableStat } from "./types/Combatant";
import {
  oneEnemy,
  generateAttack,
  opponents,
  weak,
  medium,
  mild,
} from "./actions";
import Engine from "./Engine";

type EnemyTemplate = Pick<
  Combatant,
  "name" | "maxHP" | "maxSP" | "camaraderie" | "determination" | "spirit" | "dr"
> & { actions: CombatAction[]; object: number };

export const EnemyObjects = {
  eSage: 100,
  eMonk: 101,
  eRogue: 102,
} as const;

const enemies = {
  Sage: {
    object: EnemyObjects.eSage,
    name: "Sage",
    maxHP: 20,
    maxSP: 10,
    camaraderie: 3,
    determination: 3,
    spirit: 3,
    dr: 0,
    actions: [
      generateAttack(weak),
      {
        name: "Zap",
        tags: ["attack"],
        sp: 3,
        targets: opponents(),
        act({ g, targets, me }) {
          g.applyDamage(me, targets, 3, "hp");
        },
      },
    ],
  },

  Monk: {
    object: EnemyObjects.eMonk,
    name: "Monk",
    maxHP: 20,
    maxSP: 10,
    camaraderie: 3,
    determination: 3,
    spirit: 3,
    dr: 1,
    actions: [generateAttack(medium)],
  },

  Rogue: {
    object: EnemyObjects.eRogue,
    name: "Rogue",
    maxHP: 20,
    maxSP: 10,
    camaraderie: 3,
    determination: 3,
    spirit: 3,
    dr: 0,
    actions: [
      generateAttack(mild),
      {
        name: "Arrow",
        tags: ["attack"],
        sp: 3,
        targets: oneEnemy,
        act({ g, targets, me }) {
          g.applyDamage(me, targets, medium(g), "hp");
        },
      },
    ],
  },
} satisfies Record<string, EnemyTemplate>;
export type EnemyName = keyof typeof enemies;
const EnemyNames = Object.keys(enemies);

export function isEnemyName(name: string): name is EnemyName {
  return EnemyNames.includes(name);
}

export class Enemy implements Combatant {
  isPC: false;
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
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  usedThisTurn: Set<string>;
  lastAction?: string;

  constructor(public g: Engine, public template: EnemyTemplate) {
    this.isPC = false;
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
    this.equipment = new Map();
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
}

export function spawn(g: Engine, name: EnemyName) {
  return new Enemy(g, enemies[name]);
}
