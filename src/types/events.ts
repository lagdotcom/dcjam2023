import Combatant, { AttackableStat } from "./Combatant";

export type GameEvents = {
  onCalculateDamage: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: AttackableStat;
  };

  onCalculateDR: { who: Combatant; dr: number };
};
export type GameEventName = keyof GameEvents;

export type GameEventListener = {
  [K in GameEventName]: (e: GameEvents[K]) => void;
};
