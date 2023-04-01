import Combatant from "./Combatant";

export type DamageType = "hp" | "camaraderie" | "determination";

export interface GameEffect {
  name: string;
  duration: number;

  onCalculateDamage?: (e: {
    attacker: Combatant;
    target: Combatant;
    amount: number;
    type: DamageType;
  }) => void;

  onCalculateDR?: (e: { who: Combatant; dr: number }) => void;
}

export default interface Game {
  addEffect(effect: GameEffect): void;

  applyDamage(
    attacker: Combatant,
    targets: Combatant[],
    amount: number,
    type: DamageType
  ): void;
}
