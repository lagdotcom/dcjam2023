import CombatAction, { ActionTarget } from "./types/CombatAction";

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

export const generateAttack = (plus = 0, sp = 2): CombatAction => ({
  name: "Attack",
  tags: ["attack"],
  sp,
  targets: oneOpponent,
  act({ g, targets, me }) {
    const bonus = me.attacksInARow;
    const amount = g.roll(me) + plus + bonus;
    g.applyDamage(me, targets, amount, "hp", "normal");
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

export const Bless: CombatAction = {
  name: "Bless",
  tags: ["heal", "spell"],
  sp: 1,
  targets: ally(1),
  targetFilter: (c) => c.hp < c.maxHP,
  act({ g, me, targets }) {
    for (const target of targets) {
      const amount = Math.max(0, target.camaraderie) + 2;
      g.heal(me, [target], amount);
    }
  },
};

export const Brace: CombatAction = {
  name: "Brace",
  tags: ["buff"],
  sp: 3,
  targets: onlyMe,
  act({ g, me }) {
    g.addEffect((destroy) => ({
      name: "Brace",
      duration: 2,
      affects: [me],
      buff: true,
      onCalculateDamage(e) {
        if (this.affects.includes(e.target)) {
          e.multiplier /= 2;
          destroy();
        }
      },
    }));
  },
};

export const Bravery: CombatAction = {
  name: "Bravery",
  tags: ["buff"],
  sp: 3,
  targets: allAllies,
  act({ g, targets }) {
    g.addEffect(() => ({
      name: "Bravery",
      duration: 2,
      affects: targets,
      buff: true,
      onCalculateDR(e) {
        if (this.affects.includes(e.who)) e.value += 2;
      },
    }));
  },
};

export const Defy: CombatAction = {
  name: "Defy",
  tags: ["buff"],
  sp: 3,
  targets: onlyMe,
  act({ g, me }) {
    g.addEffect(() => ({
      name: "Defy",
      duration: 2,
      affects: [me],
      onAfterDamage({ target, attacker }) {
        if (this.affects.includes(target)) return;

        g.addToLog(`${me.name} stuns ${attacker.name} with their defiance!`);
        g.addEffect(() => ({
          name: "Defied",
          duration: 1,
          affects: [attacker],
          onCanAct(e) {
            if (this.affects.includes(e.who)) e.cancel = true;
          },
        }));
      },
    }));
  },
};

export const DuoStab: CombatAction = {
  name: "DuoStab",
  tags: ["attack"],
  sp: 3,
  targets: opponents(Infinity, [0, 2]),
  act({ g, me, targets }) {
    g.applyDamage(me, targets, 6, "hp", "normal");
  },
};
