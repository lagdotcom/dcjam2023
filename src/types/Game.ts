import Combatant, { AttackableStat } from "./Combatant";
import Dir from "./Dir";
import { GameEventHandler } from "./events";
import { Cells, EffectName, HitPoints, Quadrants, Turns } from "./flavours";

export interface GameEffect extends Partial<GameEventHandler> {
  name: EffectName;
  affects: Combatant[];
  duration: Turns;
  buff?: true;
  permanent?: true;
}

export default interface Game {
  addEffect(makeEffect: (destroy: () => void) => GameEffect): void;

  addToLog(message: string): void;

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: HitPoints,
    type: AttackableStat,
    origin: "normal" | "magic",
  ): HitPoints;

  endTurn(): void;

  getAllies(me: Combatant, includeMe: boolean): Combatant[];

  getEffectsOn(who: Combatant): GameEffect[];

  getOpponent(me: Combatant, rotate?: Quadrants): Combatant | undefined;

  getPosition(who: Combatant): { dir: Dir; distance: Cells };

  heal(healer: Combatant, targets: Combatant[], amount: HitPoints): void;

  moveEnemy(from: Dir, to: Dir): void;

  removeEffectsFrom(effects: GameEffect[], who: Combatant): void;

  roll(who: Combatant, size?: number): number;
}
