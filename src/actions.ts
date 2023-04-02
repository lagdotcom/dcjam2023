import random from "./tools/random";
import { ItemAction } from "./types/Item";

export const generateAttack = (
  minDamage: number,
  maxDamage: number,
  sp = 2
): ItemAction => ({
  name: "Attack",
  sp,
  targets: "Opponent",
  act({ g, targets, me }) {
    const bonus = me.attacksInARow;
    const amount = random(maxDamage + bonus, minDamage);
    g.applyDamage(me, targets, amount, "hp");
  },
});
