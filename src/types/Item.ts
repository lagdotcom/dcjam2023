import { ClassName } from "./ClassName";
import Combatant from "./Combatant";
import Game from "./Game";

export const ItemSlots = ["Weapon", "Special", "Armour"] as const;
export type ItemSlot = (typeof ItemSlots)[number];

export interface ItemAction {
  name: string;
  sp: number;
  targets: "Self" | "OneEnemy" | "AllEnemy" | "OneParty" | "AllParty";
  act(e: { g: Game; targets: Combatant[]; me: Combatant }): void;
}

export default interface Item {
  name: string;
  className: ClassName;
  slot: ItemSlot;
  action: ItemAction;
  dr?: number;
}
