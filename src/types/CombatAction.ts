import Combatant from "./Combatant";
import Game from "./Game";

export type ActionTag = "attack" | "counter" | "defence" | "heal";

export default interface CombatAction {
  name: string;
  sp: number;
  x?: boolean;
  useMessage?: string;
  tags: ActionTag[];
  targets:
    | "Self"
    | "Opponent"
    | "OneEnemy"
    | "AllEnemy"
    | "OneAlly"
    | "AllAlly";
  act(e: { g: Game; targets: Combatant[]; me: Combatant; x: number }): void;
}
