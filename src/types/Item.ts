import { ClassName } from "./ClassName";
import CombatAction from "./CombatAction";

export const ItemSlots = ["Hand", "Body", "Special"] as const;
export type ItemSlot = (typeof ItemSlots)[number];

export default interface Item {
  name: string;
  restrict?: ClassName[];
  slot?: ItemSlot;
  type?: string;
  action: CombatAction;
  dr?: number;
  lore?: string;
}
