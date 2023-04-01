import Item, { ItemSlot } from "./Item";

export type AttackableStat =
  | "hp"
  | "sp"
  | "determination"
  | "camaraderie"
  | "spirits";

export default interface Combatant {
  name: string;
  hp: number;
  sp: number;
  maxHp: number;
  maxSp: number;
  determination: number;
  camaraderie: number;
  spirits: number;

  dr: number;
  equipment: Map<ItemSlot, Item>;
  attacksInARow: number;
  lastAction?: string;
}
