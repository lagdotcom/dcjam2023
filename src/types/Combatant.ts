import Item, { ItemSlot } from "./Item";

export const AttackableStats = [
  "hp",
  "sp",
  "determination",
  "camaraderie",
  "spirits",
] as const;
export type AttackableStat = (typeof AttackableStats)[number];

export default interface Combatant {
  name: string;
  hp: number;
  sp: number;
  maxHp: number;
  maxSp: number;
  determination: number;
  camaraderie: number;
  spirits: number;

  alive: boolean;
  dr: number;
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  lastAction?: string;
}
