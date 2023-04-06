import CombatAction from "./CombatAction";
import Combatant, { AttackableStat } from "./Combatant";
import Dir from "./Dir";
import { GameEffect } from "./Game";

export const GameEventNames = [
  "onAfterDamage",
  "onBeforeAction",
  "onCalculateDamage",
  "onCalculateDR",
  "onCalculateCamaraderie",
  "onCalculateDetermination",
  "onCalculateSpirit",
  "onCalculateMaxHP",
  "onCalculateMaxSP",
  "onCanAct",
  "onCombatOver",
  "onKilled",
  "onPartySwap",
  "onRoll",
] as const;
export type GameEventName = (typeof GameEventNames)[number];

export type GameEvents = {
  onAfterDamage: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: AttackableStat;
    origin: "normal" | "magic";
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
    multiplier: number;
    type: AttackableStat;
    origin: "normal" | "magic";
  };

  onCalculateCamaraderie: { who: Combatant; value: number };
  onCalculateDetermination: { who: Combatant; value: number };
  onCalculateSpirit: { who: Combatant; value: number };
  onCalculateDR: { who: Combatant; value: number };
  onCalculateMaxHP: { who: Combatant; value: number };
  onCalculateMaxSP: { who: Combatant; value: number };

  onCanAct: { who: Combatant; action: CombatAction; cancel: boolean };

  onCombatOver: { winners: "party" | "enemies" };

  onKilled: { who: Combatant; attacker: Combatant };

  onPartySwap: { swaps: { from: Dir; to: Dir }[] };

  onRoll: { who: Combatant; size: number; value: number };
};
export type EventHandler<K extends GameEventName> = (
  this: GameEffect,
  e: GameEvents[K]
) => void;

export type GameEventHandler = {
  [K in GameEventName]: EventHandler<K>;
};

export type GameEventListeners = {
  [K in GameEventName]: Set<EventHandler<K>>;
};
