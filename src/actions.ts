import { random } from "./tools/rng";
import CombatAction from "./types/CombatAction";

export const generateAttack = (
  minDamage: number,
  maxDamage: number,
  sp = 2
): CombatAction => ({
  name: "Attack",
  sp,
  targets: "Opponent",
  act({ g, targets, me }) {
    const bonus = me.attacksInARow;
    const amount = random(maxDamage - minDamage + bonus) + minDamage;
    g.applyDamage(me, targets, amount, "hp");
  },
});

export const endTurnAction: CombatAction = {
  name: "End Turn",
  sp: 0,
  targets: "AllAlly",
  useMessage: "",
  act({ g }) {
    g.endTurn();
  },
};
