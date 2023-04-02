import Item, { ItemAction, ItemSlot } from "./types/Item";

import Combatant from "./types/Combatant";
import random from "./tools/random";

type EnemyTemplate = Pick<
  Combatant,
  | "name"
  | "maxHp"
  | "maxSp"
  | "determination"
  | "camaraderie"
  | "spirits"
  | "dr"
> & { actions: ItemAction[]; object: number };

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
    spirits: 3,
    dr: 0,
    actions: [
      {
        name: "Attack",
        sp: 0,
        targets: "Opponent",
        act({ g, targets, me }) {
          const bonus = me.attacksInARow;
          const amount = random(5 + bonus, 2);
          g.applyDamage(me, targets, amount, "hp");
        },
      },
      {
        name: "Zap",
        sp: 2,
        targets: "AllParty",
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
    spirits: 3,
    dr: 0,
    actions: [
      {
        name: "Attack",
        sp: 0,
        targets: "Opponent",
        act({ g, targets, me }) {
          const bonus = me.attacksInARow;
          const amount = random(16 + bonus, 9);
          g.applyDamage(me, targets, amount, "hp");
        },
      },
    ],
  },

  Rogue: {
    object: EnemyObjects.eRogue,
    name: "Rogue",
    maxHp: 20,
    maxSp: 10,
    determination: 3,
    camaraderie: 3,
    spirits: 3,
    dr: 0,
    actions: [
      {
        name: "Attack",
        sp: 0,
        targets: "Opponent",
        act({ g, targets, me }) {
          const bonus = me.attacksInARow;
          const amount = random(9 + bonus, 4);
          g.applyDamage(me, targets, amount, "hp");
        },
      },
      {
        name: "Arrow",
        sp: 0,
        targets: "OneParty",
        act({ g, targets, me }) {
          g.applyDamage(me, targets, random(14, 1), "hp");
        },
      },
    ],
  },
} satisfies Record<string, EnemyTemplate>;
export type EnemyName = keyof typeof enemies;

export class Enemy implements Combatant {
  name: string;
  hp: number;
  sp: number;
  maxHp: number;
  maxSp: number;
  determination: number;
  camaraderie: number;
  spirits: number;

  dr: number;
  actions: ItemAction[];
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  lastAction?: string;

  constructor(public template: EnemyTemplate) {
    this.name = template.name;
    this.maxHp = template.maxHp;
    this.maxSp = template.maxSp;
    this.hp = this.maxHp;
    this.sp = this.maxSp;
    this.determination = template.determination;
    this.camaraderie = template.camaraderie;
    this.spirits = template.spirits;
    this.dr = template.dr;
    this.actions = template.actions;
    this.equipment = new Map();
    this.attacksInARow = 0;
  }

  get alive() {
    return this.hp > 0;
  }
}

export function spawn(name: EnemyName) {
  return new Enemy(enemies[name]);
}
