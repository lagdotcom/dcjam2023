import { GorgothilSword, Haringplate } from "./items/cleavesman";
import { Cornucopia, JacketAndRucksack } from "./items/loamSeer";
import { Penduchaimmer, HaringleeKasaya } from "./items/martialist";
import { OwlSkull, IronFullcase } from "./items/warCaller";
import { ClassName } from "./types/ClassName";
import Combatant, { AttackableStat } from "./types/Combatant";
import Item from "./types/Item";

type ClassData = Pick<Combatant, AttackableStat> & {
  items: Item[];
  skill: string;
};

const classes: Record<ClassName, ClassData> = {
  Martialist: {
    hp: 21,
    sp: 7,
    determination: 6,
    camaraderie: 2,
    spirit: 3,
    items: [Penduchaimmer, HaringleeKasaya],
    skill: "Smash",
  },
  Cleavesman: {
    hp: 25,
    sp: 6,
    determination: 4,
    camaraderie: 4,
    spirit: 3,
    items: [GorgothilSword, Haringplate],
    skill: "Cut",
  },
  "Far Scout": {
    hp: 18,
    sp: 7,
    determination: 3,
    camaraderie: 3,
    spirit: 5,
    items: [],
    skill: "Tamper",
  },
  "War Caller": {
    hp: 30,
    sp: 5,
    determination: 5,
    camaraderie: 2,
    spirit: 4,
    items: [OwlSkull, IronFullcase],
    skill: "Prayer",
  },
  "Flag Singer": {
    hp: 21,
    sp: 6,
    determination: 2,
    camaraderie: 6,
    spirit: 3,
    items: [],
    skill: "???",
  },
  "Loam Seer": {
    hp: 18,
    sp: 5,
    determination: 2,
    camaraderie: 5,
    spirit: 4,
    items: [Cornucopia, JacketAndRucksack],
    skill: "Shift",
  },
};
export default classes;
