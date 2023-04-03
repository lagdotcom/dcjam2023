import Combatant, { AttackableStat } from "./Combatant";

import { GameEventHandler } from "./events";

export interface GameEffect extends Partial<GameEventHandler> {
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

  endTurn(): void;

  roll(size: number): number;
}
