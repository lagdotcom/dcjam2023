import Combatant from "./types/Combatant";
import Item, { ItemSlot } from "./types/Item";

import { ClassName } from "./types/ClassName";
import { endTurnAction } from "./actions";
import { defaultStats, startingItems } from "./classes";

export default class Player implements Combatant {
  isPC: true;
  hp: number;
  sp: number;
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  usedThisTurn: Set<string>;

  constructor(
    public name: string,
    public className: ClassName,
    public maxHp = defaultStats[className].hp,
    public maxSp = defaultStats[className].sp,
    public determination = defaultStats[className].determination,
    public camaraderie = defaultStats[className].camaraderie,
    public spirit = defaultStats[className].spirit,
    public items = startingItems[className]
  ) {
    this.isPC = true;
    this.hp = this.maxHp;
    this.sp = Math.min(maxSp, spirit);
    this.attacksInARow = 0;
    this.equipment = new Map();
    this.usedThisTurn = new Set();

    for (const item of items) this.equip(item);
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
    this.equipment.set(item.slot, item);
  }
}
