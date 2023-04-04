import { GorgothilSword, Haringplate } from "./items/cleavesman";
import { Cornucopia, JacketAndRucksack } from "./items/loamSeer";
import { Penduchaimmer, HaringleeKasaya } from "./items/martialist";
import { OwlSkull, IronFullcase } from "./items/warCaller";
import { ClassName } from "./types/ClassName";
import Combatant, { AttackableStat } from "./types/Combatant";
import Item from "./types/Item";

export const baseStats: Record<ClassName, Pick<Combatant, AttackableStat>> = {
  Martialist: { hp: 21, sp: 7, determination: 6, camaraderie: 2, spirit: 3 },
  Cleavesman: { hp: 25, sp: 6, determination: 4, camaraderie: 4, spirit: 3 },
  "Far Scout": { hp: 18, sp: 7, determination: 3, camaraderie: 3, spirit: 5 },
  "War Caller": { hp: 30, sp: 5, determination: 5, camaraderie: 2, spirit: 4 },
  "Flag Singer": { hp: 21, sp: 6, determination: 2, camaraderie: 6, spirit: 3 },
  "Loam Seer": { hp: 18, sp: 5, determination: 2, camaraderie: 5, spirit: 4 },
};

export const startingItems: Record<ClassName, Item[]> = {
  Martialist: [Penduchaimmer, HaringleeKasaya],
  Cleavesman: [GorgothilSword, Haringplate],
  "Far Scout": [],
  "War Caller": [OwlSkull, IronFullcase],
  "Flag Singer": [],
  "Loam Seer": [Cornucopia, JacketAndRucksack],
};
