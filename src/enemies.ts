import Item, { ItemSlot } from "./types/Item";
import CombatAction from "./types/CombatAction";

import Combatant from "./types/Combatant";
import { random } from "./tools/rng";
import { oneEnemy, generateAttack, opponents } from "./actions";

type EnemyTemplate = Pick<
  Combatant,
  "name" | "maxHp" | "maxSp" | "determination" | "camaraderie" | "spirit" | "dr"
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
    maxHp: 20,
    maxSp: 10,
    determination: 3,
    camaraderie: 3,
    spirit: 3,
    dr: 0,
    actions: [
      generateAttack(2, 5),
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
    maxHp: 20,
    maxSp: 10,
    determination: 3,
    camaraderie: 3,
    spirit: 3,
    dr: 1,
    actions: [generateAttack(9, 16)],
  },

  Rogue: {
    object: EnemyObjects.eRogue,
    name: "Rogue",
    maxHp: 20,
    maxSp: 10,
    determination: 3,
    camaraderie: 3,
    spirit: 3,
    dr: 0,
    actions: [
      generateAttack(4, 9),
      {
        name: "Arrow",
        tags: ["attack"],
        sp: 3,
        targets: oneEnemy,
        act({ g, targets, me }) {
          g.applyDamage(me, targets, random(14) + 1, "hp");
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
  maxHp: number;
  maxSp: number;
  determination: number;
  camaraderie: number;
  spirit: number;

  dr: number;
  actions: CombatAction[];
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  usedThisTurn: Set<string>;
  lastAction?: string;

  constructor(public template: EnemyTemplate) {
    this.isPC = false;
    this.name = template.name;
    this.maxHp = template.maxHp;
    this.maxSp = template.maxSp;
    this.hp = this.maxHp;
    this.sp = this.maxSp;
    this.determination = template.determination;
    this.camaraderie = template.camaraderie;
    this.spirit = template.spirit;
    this.dr = template.dr;
    this.actions = template.actions;
    this.equipment = new Map();
    this.attacksInARow = 0;
    this.usedThisTurn = new Set();
  }

  get alive() {
    return this.hp > 0;
  }
}

export function spawn(name: EnemyName) {
  return new Enemy(enemies[name]);
}
