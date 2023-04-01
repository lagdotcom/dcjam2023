import { AttackableStat, AttackableStats } from "../types/Combatant";

export default function isStat(s: string): s is AttackableStat {
  return AttackableStats.includes(s as AttackableStat);
}
