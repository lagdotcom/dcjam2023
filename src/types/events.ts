import Combatant from "./Combatant";
import { DamageType } from "./Game";

export type GameEvents = {
  onCalculateDamage: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: DamageType;
  };

  onCalculateDR: { who: Combatant; dr: number };
};
export type GameEventName = keyof GameEvents;

export type GameEventListener = {
  [K in GameEventName]: (e: GameEvents[K]) => void;
};
