import Combatant from "./Combatant";
import { ActionName, LogMessage, Quadrants, SkillPoints } from "./flavours";
import Game from "./Game";
import { Predicate } from "./logic";

export type ActionTag =
  | "attack"
  | "counter"
  | "buff"
  | "duff"
  | "heal"
  | "movement"
  | "spell";

export type ActionTarget =
  | { type: "self" }
  | {
      type: "ally" | "enemy";
      count?: number;
      distance?: Quadrants;
      offsets?: (0 | 1 | 2 | 3)[];
    };

export default interface CombatAction {
  name: ActionName;
  sp: SkillPoints;
  x?: boolean;
  useMessage?: LogMessage;
  tags: ActionTag[];
  targets: ActionTarget;
  targetFilter?: Predicate<Combatant>;
  act(e: {
    g: Game;
    targets: Combatant[];
    me: Combatant;
    x: SkillPoints;
  }): void;
}
