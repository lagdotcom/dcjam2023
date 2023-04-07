import CombatAction from "./CombatAction";
import Combatant, { AttackableStat } from "./Combatant";
import Dir from "./Dir";
import { GameEffect } from "./Game";
import XY from "./XY";

export const GameEventNames = [
  "onAfterAction",
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
  "onCombatBegin",
  "onCombatOver",
  "onKilled",
  "onPartyMove",
  "onPartySwap",
  "onPartyTurn",
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

  onAfterAction: {
    attacker: Combatant;
    action: CombatAction;
    cancelled: boolean;
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

  onCalculateCamaraderie: { who: Combatant; value: number; multiplier: number };
  onCalculateDetermination: {
    who: Combatant;
    value: number;
    multiplier: number;
  };
  onCalculateSpirit: { who: Combatant; value: number; multiplier: number };
  onCalculateDR: { who: Combatant; value: number; multiplier: number };
  onCalculateMaxHP: { who: Combatant; value: number; multiplier: number };
  onCalculateMaxSP: { who: Combatant; value: number; multiplier: number };

  onCanAct: { who: Combatant; action: CombatAction; cancel: boolean };

  onCombatBegin: { type: "normal" | "arena" };
  onCombatOver: { winners: "party" | "enemies" };

  onKilled: { who: Combatant; attacker: Combatant };

  onPartyMove: { from: XY; to: XY };
  onPartySwap: { swaps: { from: Dir; to: Dir }[] };
  onPartyTurn: { from: Dir; to: Dir };

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
