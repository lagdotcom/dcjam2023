import { ClassName } from "./ClassName";
import CombatAction from "./CombatAction";
import { BoostableStat } from "./Combatant";

export const ItemSlots = ["Hand", "Body", "Special"] as const;
export type ItemSlot = (typeof ItemSlots)[number];

export default interface Item {
  name: string;
  restrict?: ClassName[];
  slot?: ItemSlot;
  type?: string;
  action: CombatAction;
  bonus: Partial<Record<BoostableStat, number>>;
  lore?: string;
}
