import Combatant from "./Combatant";
import Game from "./Game";
import { Predicate } from "./logic";

export type ActionTag =
  | "attack"
  | "counter"
  | "defence+"
  | "defence-"
  | "heal"
  | "strength+"
  | "strength-";

export type ActionTarget =
  | { type: "self" }
  | {
      type: "ally" | "enemy";
      count?: number;
      distance?: number;
      offsets?: (0 | 1 | 2 | 3)[];
    };

export default interface CombatAction {
  name: string;
  sp: number;
  x?: boolean;
  useMessage?: string;
  tags: ActionTag[];
  targets: ActionTarget;
  targetFilter?: Predicate<Combatant>;
  act(e: { g: Game; targets: Combatant[]; me: Combatant; x: number }): void;
}
