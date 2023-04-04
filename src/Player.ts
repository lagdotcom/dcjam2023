import Combatant, { AttackableStat } from "./types/Combatant";
import Item, { ItemSlot } from "./types/Item";

import { ClassName } from "./types/ClassName";
import { endTurnAction } from "./actions";
import { baseStats, startingItems } from "./classes";
import Engine from "./Engine";

function getBaseStat(
  className: ClassName,
  stat: AttackableStat,
  bonusStat?: AttackableStat,
  bonusIfTrue = 1
) {
  return baseStats[className][stat] + (bonusStat === stat ? bonusIfTrue : 0);
}

export default class Player implements Combatant {
  isPC: true;
  hp: number;
  sp: number;
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  usedThisTurn: Set<string>;
  maxHp: number;
  maxSp: number;
  determination: number;
  camaraderie: number;
  spirit: number;

  constructor(
    public g: Engine,
    public name: string,
    public className: ClassName,
    bonus?: AttackableStat,
    items = startingItems[className]
  ) {
    this.isPC = true;
    this.maxHp = getBaseStat(className, "hp", bonus, 5);
    this.hp = this.maxHp;
    this.maxSp = getBaseStat(className, "sp", bonus);
    this.determination = getBaseStat(className, "determination", bonus);
    this.camaraderie = getBaseStat(className, "camaraderie", bonus);
    this.spirit = getBaseStat(className, "spirit", bonus);
    this.sp = Math.min(this.maxSp, this.spirit);
    this.attacksInARow = 0;
    this.equipment = new Map();
    this.usedThisTurn = new Set();

    for (const item of items) {
      if (item.slot) this.equip(item);
      else g.inventory.push(item);
    }
  }

  get alive() {
    return this.hp > 0;
  }

  get dr() {
    let value = 0;
    for (const item of this.equipment.values()) if (item?.dr) value += item.dr;

    return value;
  }

  get actions() {
    return Array.from(this.equipment.values())
      .map((i) => i.action)
      .concat(endTurnAction);
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
