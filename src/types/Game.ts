import Combatant, { AttackableStat } from "./Combatant";

import { GameEventListener } from "./events";

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
    type: AttackableStat
  ): void;
}
