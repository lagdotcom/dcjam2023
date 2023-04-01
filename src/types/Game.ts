import Combatant from "./Combatant";
import { GameEventListener } from "./events";

export type DamageType = "hp" | "camaraderie" | "determination";

export interface GameEffect extends Partial<GameEventListener> {
  name: string;
  affects: Combatant[];
  duration: number;
}

export default interface Game {
  addEffect(effect: GameEffect): void;

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: DamageType
  ): void;
}
