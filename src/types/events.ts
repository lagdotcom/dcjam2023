import Combatant, { AttackableStat } from "./Combatant";

export const GameEventNames = [
  "onCalculateDamage",
  "onCalculateDR",
  "onKilled",
  "onRoll",
] as const;
export type GameEventName = (typeof GameEventNames)[number];

export type GameEvents = {
  onCalculateDamage: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: AttackableStat;
  };

  onCalculateDR: { who: Combatant; dr: number };

  onKilled: { who: Combatant; attacker: Combatant };

  onRoll: { size: number; value: number };
};
export type EventHandler<K extends GameEventName> = (e: GameEvents[K]) => void;

export type GameEventHandler = {
  [K in GameEventName]: EventHandler<K>;
};

export type GameEventListeners = {
  [K in GameEventName]: Set<EventHandler<K>>;
};
