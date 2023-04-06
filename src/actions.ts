import isDefined from "./tools/isDefined";
import { oneOf } from "./tools/rng";
import { intersection } from "./tools/sets";
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

export const Barb: CombatAction = {
  name: "Barb",
  tags: ["counter"],
  sp: 3,
  targets: onlyMe,
  act({ g, me }) {
    g.addEffect(() => ({
      name: "Barb",
      duration: 2,
      affects: [me],
      onAfterDamage(e) {
        if (this.affects.includes(e.target)) {
          const targets = [
            g.getOpponent(me, 0),
            g.getOpponent(me, 1),
            g.getOpponent(me, 3),
          ].filter(isDefined);

          if (targets.length) {
            const target = oneOf(targets);
            const amount = g.roll(me);

            g.addToLog(`${e.target.name} flails around!`);
            g.applyDamage(me, [target], amount, "hp", "normal");
          }
        }
      },
    }));
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

export const Deflect: CombatAction = {
  name: "Deflect",
  tags: ["buff"],
  sp: 2,
  targets: onlyMe,
  act({ g, me }) {
    g.addEffect((destroy) => ({
      name: "Deflect",
      duration: Infinity,
      affects: [me],
      onCalculateDamage(e) {
        if (this.affects.includes(e.target)) {
          g.addToLog(`${me.name} deflects the blow.`);
          e.multiplier = 0;
          destroy();
          return;
        }
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
        if (!this.affects.includes(target)) return;

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

export const Flight: CombatAction = {
  name: "Flight",
  tags: ["attack"],
  sp: 4,
  targets: opponents(1, [1, 3]),
  act({ g, me, targets }) {
    const amount = g.roll(me) + 10;
    g.applyDamage(me, targets, amount, "hp", "normal");
  },
};

export const Parry: CombatAction = {
  name: "Parry",
  tags: ["counter", "buff"],
  sp: 3,
  targets: onlyMe,
  act({ g, me }) {
    g.addEffect((destroy) => ({
      name: "Parry",
      duration: Infinity,
      affects: [me],
      onBeforeAction(e) {
        if (
          intersection(this.affects, e.targets).length &&
          e.action.tags.includes("attack")
        ) {
          g.addToLog(`${me.name} counters!`);

          const amount = g.roll(me);
          g.applyDamage(me, [e.attacker], amount, "hp", "normal");
          destroy();
          e.cancel = true;
          return;
        }
      },
    }));
  },
};

export const Sand: CombatAction = {
  name: "Sand",
  tags: ["duff"],
  sp: 3,
  targets: oneOpponent,
  act({ g, targets }) {
    g.addEffect(() => ({
      name: "Sand",
      duration: Infinity,
      affects: targets,
      onCalculateDetermination(e) {
        if (this.affects.includes(e.who)) e.value--;
      },
    }));
  },
};

export const Scar: CombatAction = {
  name: "Scar",
  tags: ["attack"],
  sp: 3,
  targets: oneOpponent,
  act({ g, me, targets }) {
    const amount = 4;
    g.applyDamage(me, targets, amount, "hp", "normal");
    g.applyDamage(me, targets, amount, "hp", "normal");
    g.applyDamage(me, targets, amount, "hp", "normal");
  },
};

export const Trick: CombatAction = {
  name: "Trick",
  tags: ["duff"],
  sp: 3,
  targets: oneOpponent,
  act({ g, targets }) {
    g.addEffect(() => ({
      name: "Trick",
      duration: Infinity,
      affects: targets,
      onCalculateCamaraderie(e) {
        if (this.affects.includes(e.who)) e.value--;
      },
    }));
  },
};
