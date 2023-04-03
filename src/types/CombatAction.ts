import Combatant from "./Combatant";
import Game from "./Game";

export default interface CombatAction {
  name: string;
  sp: number;
  targets:
    | "Self"
    | "Opponent"
    | "OneEnemy"
    | "AllEnemy"
    | "OneParty"
    | "AllParty";
  act(e: { g: Game; targets: Combatant[]; me: Combatant }): void;
}
