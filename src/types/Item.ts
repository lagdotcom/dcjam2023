import { ClassName } from "./ClassName";
import CombatAction from "./CombatAction";
import { BoostableStat } from "./Combatant";
import { Description, ItemName } from "./flavours";

export const ItemSlots = ["Hand", "Body", "Special"] as const;
export type ItemSlot = (typeof ItemSlots)[number];

export default interface Item {
  name: ItemName;
  restrict?: ClassName[];
  slot?: ItemSlot;
  type?: "Weapon" | "Armour" | "Shield" | "Catalyst" | "Flag" | "Consumable";
  action: CombatAction;
  bonus: Partial<Record<BoostableStat, number>>;
  lore?: Description;
}
