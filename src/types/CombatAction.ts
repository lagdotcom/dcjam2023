import Combatant from "./Combatant";
import Game from "./Game";

export default interface CombatAction {
  name: string;
  sp: number;
  x?: boolean;
  useMessage?: string;
  targets:
    | "Self"
    | "Opponent"
    | "OneEnemy"
    | "AllEnemy"
    | "OneAlly"
    | "AllAlly";
  act(e: { g: Game; targets: Combatant[]; me: Combatant; x: number }): void;
}
