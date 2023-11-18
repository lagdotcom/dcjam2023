import Combatant, { AttackableStat } from "./Combatant";
import Dir from "./Dir";
import { GameEventHandler } from "./events";

export interface GameEffect extends Partial<GameEventHandler> {
  name: string;
  affects: Combatant[];
  duration: number;
  buff?: true;
  permanent?: true;
}

export default interface Game {
  addEffect(makeEffect: (destroy: () => void) => GameEffect): void;

  addToLog(message: string): void;

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: AttackableStat,
    origin: "normal" | "magic",
  ): number;

  endTurn(): void;

  getAllies(me: Combatant, includeMe: boolean): Combatant[];

  getEffectsOn(who: Combatant): GameEffect[];

  getOpponent(me: Combatant, rotate?: number): Combatant | undefined;

  getPosition(who: Combatant): { dir: Dir; distance: number };

  heal(healer: Combatant, targets: Combatant[], amount: number): void;

  moveEnemy(from: Dir, to: Dir): void;

  removeEffectsFrom(effects: GameEffect[], who: Combatant): void;

  roll(who: Combatant, size?: number): number;
}
