import CombatAction from "./CombatAction";
import Combatant, { AttackableStat } from "./Combatant";

export const GameEventNames = [
  "onAfterDamage",
  "onBeforeAction",
  "onCalculateDamage",
  "onCalculateDetermination",
  "onCalculateDR",
  "onCanAct",
  "onKilled",
  "onRoll",
] as const;
export type GameEventName = (typeof GameEventNames)[number];

export type GameEvents = {
  onAfterDamage: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: AttackableStat;
  };

  onBeforeAction: {
    attacker: Combatant;
    action: CombatAction;
    cancel: boolean;
    targets: Combatant[];
  };

  onCalculateDamage: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: AttackableStat;
  };

  onCalculateDetermination: { who: Combatant; value: number };
  onCalculateDR: { who: Combatant; value: number };

  onCanAct: { who: Combatant; action: CombatAction; cancel: boolean };

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
