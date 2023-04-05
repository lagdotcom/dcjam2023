import Combatant, { AttackableStat, BoostableStat } from "./types/Combatant";
import Item, { ItemSlot } from "./types/Item";

import { ClassName } from "./types/ClassName";
import { endTurnAction, generateAttack, mild } from "./actions";
import classes from "./classes";
import Engine from "./Engine";

function getBaseStat(
  className: ClassName,
  stat: AttackableStat,
  bonusStat?: AttackableStat,
  bonusIfTrue = 1
) {
  return classes[className][stat] + (bonusStat === stat ? bonusIfTrue : 0);
}

export default class Player implements Combatant {
  name: string;
  isPC: true;
  hp: number;
  sp: number;
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  usedThisTurn: Set<string>;
  baseMaxHP: number;
  baseMaxSP: number;
  baseCamaraderie: number;
  baseDetermination: number;
  baseSpirit: number;
  skill: string;

  constructor(
    public g: Engine,
    public className: ClassName,
    bonus?: AttackableStat,
    items = classes[className].items
  ) {
    this.name = classes[className].name;
    this.isPC = true;
    this.attacksInARow = 0;
    this.equipment = new Map();
    this.usedThisTurn = new Set();
    this.skill = classes[className].skill;

    for (const item of items) {
      if (item.slot) this.equip(item);
      else g.inventory.push(item);
    }

    this.baseMaxHP = getBaseStat(className, "hp", bonus, 5);
    this.baseMaxSP = getBaseStat(className, "sp", bonus);
    this.baseCamaraderie = getBaseStat(className, "camaraderie", bonus);
    this.baseDetermination = getBaseStat(className, "determination", bonus);
    this.baseSpirit = getBaseStat(className, "spirit", bonus);
    this.hp = this.maxHP;
    this.sp = Math.min(this.baseMaxSP, this.spirit);
  }

  get alive() {
    return this.hp > 0;
  }

  getStat(stat: BoostableStat, base = 0): number {
    let value = base;

    for (const item of this.equipment.values()) {
      value += item?.bonus[stat] ?? 0;
    }

    return this.g.applyStatModifiers(this, stat, value);
  }

  get maxHP() {
    return this.getStat("maxHP", this.baseMaxHP);
  }
  get maxSP() {
    return this.getStat("maxHP", this.baseMaxSP);
  }

  get dr() {
    return this.getStat("dr", 0);
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

  get actions() {
    return Array.from(this.equipment.values())
      .map((i) => i.action)
      .concat(generateAttack(mild), endTurnAction);
  }

  get canMove() {
    return !this.alive || this.sp > 0;
  }

  move() {
    if (this.alive) this.sp--;
  }

  equip(item: Item) {
    // TODO
    if (item.slot) this.equipment.set(item.slot, item);
  }
}
