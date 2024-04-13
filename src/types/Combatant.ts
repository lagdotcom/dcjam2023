import CombatAction from "./CombatAction";
import { ActionName, CombatantName, HitPoints, SkillPoints } from "./flavours";

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
  name: CombatantName;
  hp: HitPoints;
  sp: SkillPoints;
  maxHP: HitPoints;
  maxSP: SkillPoints;
  camaraderie: number;
  determination: number;
  spirit: number;

  alive: boolean;
  dr: HitPoints;
  actions: CombatAction[];
  attacksInARow: number;
  usedThisTurn: Set<ActionName>;
  lastAction?: ActionName;
}
