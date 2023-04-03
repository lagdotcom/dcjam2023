import Combatant, { AttackableStat } from "./types/Combatant";
import Item, { ItemSlot } from "./types/Item";

import { ClassName } from "./types/ClassName";
import { Axe, Club, Dagger, Mace, Staff, Sword } from "./items";

// TODO
const defaultStats: Record<ClassName, Pick<Combatant, AttackableStat>> = {
  Bard: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirit: 5 },
  Brawler: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirit: 5 },
  Knight: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirit: 5 },
  Mage: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirit: 5 },
  Paladin: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirit: 5 },
  Thief: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirit: 5 },
};

// TODO
const startingItems: Record<ClassName, Item[]> = {
  Bard: [Dagger],
  Brawler: [Axe],
  Knight: [Sword],
  Mage: [Staff],
  Paladin: [Mace],
  Thief: [Club],
};

export default class Player implements Combatant {
  isPC: true;
  hp: number;
  sp: number;
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;

  constructor(
    public name: string,
    public className: ClassName,
    public maxHp = defaultStats[className].hp,
    public maxSp = defaultStats[className].sp,
    public determination = defaultStats[className].determination,
    public camaraderie = defaultStats[className].camaraderie,
    public spirit = defaultStats[className].spirit,
    items = startingItems[className]
  ) {
    this.isPC = true;
    this.hp = this.maxHp;
    this.sp = Math.min(maxSp, spirit);
    this.attacksInARow = 0;
    this.equipment = new Map();

    for (const item of items) this.equipment.set(item.slot, item);
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
      .concat({
        name: "End Turn",
        sp: 0,
        targets: "AllAlly",
        act({ g }) {
          g.endTurn();
        },
      });
  }
}
