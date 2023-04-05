import Combatant, { AttackableStat } from "./Combatant";

import { GameEventHandler } from "./events";

export interface GameEffect extends Partial<GameEventHandler> {
  name: string;
  affects: Combatant[];
  duration: number;
}

export default interface Game {
  addEffect(makeEffect: (destroy: () => void) => GameEffect): void;

  addToLog(message: string): void;

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: AttackableStat
  ): number;

  endTurn(): void;

  getAllies(me: Combatant, includeMe: boolean): Combatant[];

  getOpponent(me: Combatant, rotate?: number): Combatant | undefined;

  heal(healer: Combatant, targets: Combatant[], amount: number): void;

  roll(size: number): number;
}
