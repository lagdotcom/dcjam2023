import Item, { ItemSlot } from "./Item";
import CombatAction from "./CombatAction";

export const AttackableStats = [
  "hp",
  "sp",
  "determination",
  "camaraderie",
  "spirit",
] as const;
export type AttackableStat = (typeof AttackableStats)[number];

export default interface Combatant {
  isPC: boolean;
  name: string;
  hp: number;
  sp: number;
  maxHp: number;
  maxSp: number;
  determination: number;
  camaraderie: number;
  spirit: number;

  alive: boolean;
  dr: number;
  actions: CombatAction[];
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  lastAction?: string;
}
