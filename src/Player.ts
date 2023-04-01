import Combatant, { AttackableStat } from "./types/Combatant";
import Item, { ItemSlot } from "./types/Item";

import { ClassName } from "./types/ClassName";

// TODO
const defaultStats: Record<ClassName, Pick<Combatant, AttackableStat>> = {
  Bard: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirits: 5 },
  Brawler: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirits: 5 },
  Knight: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirits: 5 },
  Mage: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirits: 5 },
  Paladin: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirits: 5 },
  Thief: { hp: 10, sp: 10, determination: 5, camaraderie: 5, spirits: 5 },
};

export default class Player implements Combatant {
  hp: number;
  sp: number;
  equipment: Map<ItemSlot, Item>;

  // TODO
  attacksInARow: number;

  constructor(
    public name: string,
    public className: ClassName,
    public maxHp = defaultStats[className].hp,
    public maxSp = defaultStats[className].sp,
    public determination = defaultStats[className].determination,
    public camaraderie = defaultStats[className].camaraderie,
    public spirits = defaultStats[className].spirits
  ) {
    this.hp = this.maxHp;
    this.sp = Math.min(maxSp, spirits);
    this.attacksInARow = 0;
    this.equipment = new Map();
  }

  get dr() {
    let value = 0;
    for (const item of this.equipment.values()) if (item?.dr) value += item.dr;

    return value;
  }
}
