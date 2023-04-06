import CombatAction from "./CombatAction";

export const AttackableStats = [
  "hp",
  "sp",
  "camaraderie",
  "determination",
  "spirit",
] as const;
export type AttackableStat = (typeof AttackableStats)[number];

export const BoostableStats = [
  "dr",
  "maxHP",
  "maxSP",
  "camaraderie",
  "determination",
  "spirit",
] as const;
export type BoostableStat = (typeof BoostableStats)[number];

export default interface Combatant {
  isPC: boolean;
  name: string;
  hp: number;
  sp: number;
  maxHP: number;
  maxSP: number;
  camaraderie: number;
  determination: number;
  spirit: number;

  alive: boolean;
  dr: number;
  actions: CombatAction[];
  attacksInARow: number;
  usedThisTurn: Set<string>;
  lastAction?: string;
}
