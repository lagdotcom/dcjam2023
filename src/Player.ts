import Combatant, { AttackableStat } from "./types/Combatant";

import { ClassName } from "./types/ClassName";

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
  }
}
