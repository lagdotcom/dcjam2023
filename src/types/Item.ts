import { ClassName } from "./ClassName";
import CombatAction from "./CombatAction";

export const ItemSlots = ["Weapon", "Special", "Armour"] as const;
export type ItemSlot = (typeof ItemSlots)[number];

export default interface Item {
  name: string;
  restrict?: ClassName[];
  slot: ItemSlot;
  action: CombatAction;
  dr?: number;
}
