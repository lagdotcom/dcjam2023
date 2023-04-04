import { random } from "./tools/rng";
import CombatAction, { ActionTarget } from "./types/CombatAction";
import Game from "./types/Game";

// damage/heal amounts
export const mild = (g: Game) => g.roll(6) + 2;
export const medium = (g: Game) => g.roll(8) + 4;
export const heavy = (g: Game) => g.roll(12) + 6;

// targeting types
export const onlyMe: ActionTarget = { type: "self" };
export const ally = (count: number): ActionTarget => ({ type: "ally", count });
export const allAllies: ActionTarget = { type: "ally" };
export const oneOpponent: ActionTarget = {
  type: "enemy",
  distance: 1,
  count: 1,
  offsets: [0],
};
export const opponents = (
  count?: number,
  offsets?: (0 | 1 | 2 | 3)[]
): ActionTarget => ({
  type: "enemy",
  distance: 1,
  count,
  offsets,
});
export const oneEnemy: ActionTarget = { type: "enemy", count: 1 };

export const generateAttack = (
  minDamage: number,
  maxDamage: number,
  sp = 2
): CombatAction => ({
  name: "Attack",
  tags: ["attack"],
  sp,
  targets: oneOpponent,
  act({ g, targets, me }) {
    const bonus = me.attacksInARow;
    const amount = random(maxDamage - minDamage + bonus) + minDamage;
    g.applyDamage(me, targets, amount, "hp");
  },
});

export const endTurnAction: CombatAction = {
  name: "End Turn",
  tags: [],
  sp: 0,
  targets: allAllies,
  useMessage: "",
  act({ g }) {
    g.endTurn();
  },
};

export const Brace: CombatAction = {
  name: "Brace",
  tags: ["defence+"],
  sp: 3,
  targets: onlyMe,
  act({ g, me }) {
    g.addEffect((destroy) => ({
      name: "Brace",
      duration: Infinity,
      affects: [me],
      onCalculateDamage(e) {
        if (e.target === me) {
          e.amount /= 2;
          destroy();
        }
      },
    }));
  },
};

export const DuoStab: CombatAction = {
  name: "DuoStab",
  tags: ["attack"],
  sp: 3,
  targets: opponents(Infinity, [0, 2]),
  act({ g, me }) {
    const amount = mild(g);

    const front = g.getOpponent(me);
    if (front) g.applyDamage(me, [front], amount, "hp");

    const opposite = g.getOpponent(me, 2);
    if (opposite) g.applyDamage(me, [opposite], amount / 2, "hp");
  },
};
