import { rotate } from "./tools/geometry";
import isDefined from "./tools/isDefined";
import { listOfPeople, pluralS } from "./tools/lists";
import { oneOf } from "./tools/rng";
import { intersection } from "./tools/sets";
import { ActionImpl } from "./types/CombatAction";
import { AttackableStat } from "./types/Combatant";

const makeAttack =
  ({
    base,
    roll = true,
    type = "hp",
    origin = "normal",
  }: {
    base: number;
    roll?: boolean;
    type?: AttackableStat;
    origin?: "normal" | "magic";
  }): ActionImpl =>
  ({ g, me, targets }) => {
    const rollAmount = roll ? g.roll(me) : 0;
    const amount = rollAmount + base;
    g.applyDamage(me, targets, amount, type, origin);
  };

export const Arrow = makeAttack({ base: 2 });

export const Attack: ActionImpl = ({ g, targets, me }) => {
  const bonus = me.attacksInARow;
  const amount = g.roll(me) + bonus;
  g.applyDamage(me, targets, amount, "hp", "normal");
};

export const Barb: ActionImpl = ({ g, me }) => {
  g.addEffect(() => ({
    name: "Barb",
    duration: 2,
    affects: [me],
    onAfterDamage({ target }) {
      if (this.affects.includes(target)) {
        const targets = [
          g.getOpponent(me, 0),
          g.getOpponent(me, 1),
          g.getOpponent(me, 3),
        ].filter(isDefined);

        if (targets.length) {
          const target = oneOf(targets);
          const amount = g.roll(me);

          g.addToLog(`${target.name} flails around!`);
          g.applyDamage(me, [target], amount, "hp", "normal");
        }
      }
    },
  }));
};

export const Bash = makeAttack({ base: 4 });

export const Bind: ActionImpl = ({ g, targets }) => {
  // TODO is/are
  g.addToLog(`${listOfPeople(targets.map((x) => x.name))} is bound tightly!`);
  g.addEffect(() => ({
    name: "Bind",
    duration: 2,
    affects: targets,
    onCanAct(e) {
      if (this.affects.includes(e.who)) e.cancel = true;
    },
  }));
};

export const Bless: ActionImpl = ({ g, me, targets }) => {
  for (const target of targets) {
    const amount = Math.max(0, target.camaraderie) + 2;
    g.heal(me, [target], amount);
  }
};

export const Brace: ActionImpl = ({ g, me }) => {
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
};

export const Bravery: ActionImpl = ({ g, targets }) => {
  g.addEffect(() => ({
    name: "Bravery",
    duration: 2,
    affects: targets,
    buff: true,
    onCalculateDR(e) {
      if (this.affects.includes(e.who)) e.value += 2;
    },
  }));
};

export const Chakra: ActionImpl = ({ g, me }) => {
  g.addEffect(() => ({
    name: "Chakra",
    duration: 2,
    affects: [me],
    buff: true,
    onRoll(e) {
      if (this.affects.includes(e.who)) e.value = e.size;
    },
  }));
};

export const Cheer: ActionImpl = ({ g, targets }) => {
  g.addToLog(
    `${listOfPeople(targets.map((x) => x.name))} feel${pluralS(
      targets,
    )} more protected.`,
  );
  g.addEffect(() => ({
    name: "Cheer",
    duration: 2,
    affects: targets,
    buff: true,
    onCalculateDR(e) {
      if (this.affects.includes(e.who)) e.value += 3;
    },
  }));
};

export const Conduct: ActionImpl = ({ g, me, targets }) => {
  const dealt = g.applyDamage(me, targets, 6, "hp", "normal");
  if (dealt > 0) {
    const ally = oneOf(g.getAllies(me, false));

    if (ally) {
      g.addToLog(`${me.name} conducts ${ally.name}'s next attack.`);
      g.addEffect((destroy) => ({
        name: "Conduct",
        duration: 1,
        affects: [ally],
        buff: true,
        onCalculateDamage(e) {
          if (this.affects.includes(e.attacker)) {
            const bonus = g.roll(me);
            e.amount += bonus;
            destroy();
          }
        },
      }));
    }
  }
};

export const Crackle: ActionImpl = ({ g, me, targets, x }) => {
  for (let i = 0; i < x; i++) {
    const alive = targets.filter((t) => t.alive);
    if (!alive.length) return;

    const target = oneOf(alive);
    const amount = g.roll(me) + 2;
    g.applyDamage(me, [target], amount, "hp", "magic");
  }
};

export const Deflect: ActionImpl = ({ g, me }) => {
  g.addEffect((destroy) => ({
    name: "Deflect",
    duration: 2,
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
};

export const Defy: ActionImpl = ({ g, me }) => {
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
};

export const DuoStab: ActionImpl = ({ g, me, targets }) => {
  g.applyDamage(me, targets, 6, "hp", "normal");
};

export const EndTurn: ActionImpl = ({ g }) => g.endTurn();

export const Endure: ActionImpl = ({ g, me }) => {
  g.addEffect(() => ({
    name: "Endure",
    duration: 2,
    affects: [me],
    buff: true,
    onCalculateDR(e) {
      if (this.affects.includes(e.who)) e.value += 2;
    },
  }));

  const opposite = g.getOpponent(me);
  if (opposite) {
    g.addToLog(
      `${opposite.name} withers in the face of ${me.name}'s endurance!`,
    );
    g.addEffect(() => ({
      name: "Endured",
      duration: 2,
      affects: [opposite],
      onCalculateDetermination(e) {
        if (this.affects.includes(e.who)) e.value -= 2;
      },
    }));
  }
};

export const Flight = makeAttack({ base: 10 });

export const Fortify: ActionImpl = () => {
  // TODO Raise the Determination of all allies by 2 until the end of the round.
};

export const Gleam: ActionImpl = ({ g, me }) => {
  g.addEffect((destroy) => ({
    name: "Gleam",
    duration: 2,
    affects: [me],
    onBeforeAction(e) {
      if (
        intersection(this.affects, e.targets).length &&
        e.action.tags.includes("spell")
      ) {
        e.cancel = true;
        g.addToLog(`The gleam disrupts the spell.`);
        destroy();
        return;
      }
    },
  }));
};

export const Gouge: ActionImpl = ({ g, me, targets }) => {
  const amount = g.roll(me) + 6;
  if (g.applyDamage(me, targets, amount, "hp", "normal") > 0) {
    g.addEffect(() => ({
      name: "Gouge",
      duration: 2,
      affects: targets,
      onCalculateDR(e) {
        if (this.affects.includes(e.who)) e.multiplier = 0;
      },
    }));
  }
};

export const Honour: ActionImpl = ({ g, targets }) => {
  g.addEffect(() => ({
    name: "Honour",
    duration: 2,
    affects: targets,
    buff: true,
    onCalculateDamage(e) {
      if (this.affects.includes(e.target) && e.type === "determination")
        e.multiplier = 0;
    },
  }));
};

export const Inspire: ActionImpl = ({ g, me, targets }) => {
  g.addEffect(() => ({
    name: "Inspire",
    duration: 2,
    affects: targets,
    onCalculateDamage(e) {
      if (this.affects.includes(e.target)) {
        e.multiplier = 0;
        g.addToLog(`${e.attacker.name} faces backlash!`);
        g.applyDamage(me, [e.attacker], g.roll(me), "hp", "magic");
      }
    },
  }));
};

export const Kneel: ActionImpl = ({ g, me }) => {
  g.addToLog(`${me.name} is ready to accept judgement.`);
  g.addEffect(() => ({
    name: "Kneel",
    duration: 2,
    affects: [me],
    onCalculateDR(e) {
      if (this.affects.includes(e.who)) e.value = 0;
    },
  }));
};

export const Lash: ActionImpl = ({ g, me, targets }) => {
  if (g.applyDamage(me, targets, 3, "hp", "normal") > 0) {
    g.addToLog(
      `${listOfPeople(targets.map((x) => x.name))} feel${pluralS(
        targets,
      )} temporarily demoralized.`,
    );
    g.addEffect(() => ({
      name: "Lash",
      duration: 2,
      affects: targets,
      onCalculateDetermination(e) {
        if (this.affects.includes(e.who)) e.value--;
      },
    }));
  }
};

export const Lure: ActionImpl = () => {
  // TODO In combat, draw a random extra enemy into combat. outside of it, coax a placed enemy towards your position.
};

export const Mantra: ActionImpl = ({ g, me, targets }) => {
  // TODO I think this crashes the game?
  me.determination--;
  for (const target of targets) {
    target.determination++;
    g.addToLog(`${me.name} gives everything to inspire ${target.name}.`);
  }
};

export const Mudra: ActionImpl = ({ g, me }) => {
  g.addEffect(() => ({
    name: "Mudra",
    duration: 2,
    affects: [me],
    onCalculateDamage(e) {
      if (intersection(this.affects, [e.attacker, e.target]).length)
        e.multiplier *= 2;
    },
  }));
};

export const Muse: ActionImpl = ({ g, targets }) => {
  g.addEffect(() => ({
    name: "Muse",
    duration: 2,
    affects: targets,
    onCalculateDamage(e) {
      if (this.affects.includes(e.attacker)) e.amount += e.attacker.camaraderie;
    },
  }));
};

export const Observe: ActionImpl = ({ g, targets }) => {
  // TODO have/has
  g.addToLog(
    `${listOfPeople(targets.map((x) => x.name))} has nowhere to hide!`,
  );

  // TODO: [Observe] enemy is more likely to drop items

  g.addEffect(() => ({
    name: "Observe",
    duration: 2,
    affects: targets,
    onCalculateDR(e) {
      if (this.affects.includes(e.who)) e.value--;
    },
  }));
};

export const Parry: ActionImpl = ({ g, me }) => {
  g.addEffect((destroy) => ({
    name: "Parry",
    duration: 2,
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
};

export const Pose: ActionImpl = ({ g, me }) => {
  const front = g.getPosition(me).dir;
  const right = rotate(front, 1);
  const back = rotate(front, 2);
  const left = rotate(front, 3);

  const frontIsEmpty = () => !g.getOpponent(me);
  const rightIsEmpty = () => !g.getOpponent(me, 1);
  const backIsEmpty = () => !g.getOpponent(me, 2);
  const leftIsEmpty = () => !g.getOpponent(me, 3);

  if (frontIsEmpty()) {
    if (!leftIsEmpty()) {
      g.moveEnemy(left, front);
    } else if (!rightIsEmpty()) {
      g.moveEnemy(right, front);
    }
  }

  if (!backIsEmpty) {
    if (leftIsEmpty()) {
      g.moveEnemy(back, left);
    } else if (rightIsEmpty()) {
      g.moveEnemy(back, right);
    }
  }
};

export const Rain: ActionImpl = () => {
  // TODO Deals 1d10 damage to all surrounding targets.
};

export const Ram: ActionImpl = ({ g, me, targets }) => {
  g.applyDamage(me, targets, 6, "hp", "normal");
  g.applyDamage(me, targets, 1, "camaraderie", "normal");
  g.applyDamage(me, targets, 6, "hp", "normal");
  g.applyDamage(me, targets, 1, "camaraderie", "normal");

  for (const target of targets) {
    if (target.camaraderie <= 0)
      g.applyDamage(me, [target], g.roll(me), "hp", "normal");
  }
};

export const Reforge: ActionImpl = ({ g, me }) => {
  g.heal(me, [me], Infinity);
};

export const Rumble: ActionImpl = ({ g, me }) => {
  const amount = g.roll(me) + 10;
  const opponent = g.getOpponent(me);
  const others = [
    g.getOpponent(me, 1),
    g.getOpponent(me, 2),
    g.getOpponent(me, 3),
  ].filter(isDefined);

  const targets = [opponent, oneOf(others)].filter(isDefined);
  g.applyDamage(me, targets, amount, "hp", "magic");
  g.applyDamage(me, targets, 1, "spirit", "magic");
};

export const Sand: ActionImpl = ({ g, me, targets }) => {
  g.applyDamage(me, targets, 1, "determination", "normal");
};

export const Scar: ActionImpl = ({ g, me, targets }) => {
  const amount = 4;
  g.applyDamage(me, targets, amount, "hp", "normal");
  g.applyDamage(me, targets, amount, "hp", "normal");
  g.applyDamage(me, targets, amount, "hp", "normal");
};

export const Search: ActionImpl = () => {
  // TODO Increases likelihood to obtain spoils after battle.
};

export const Smash: ActionImpl = ({ g, me, targets, x }) => {
  const magnitude = x + Math.floor((me.hp / me.maxHP) * 8);
  g.applyDamage(me, targets, magnitude * 4, "hp", "normal");
};

export const Stealth: ActionImpl = () => {
  // TODO Extra 1d10 to yr party's next roll on a non-combat skill / in combat, each ally gets a Dodge-the-next-attack charge. (agh does the first thing work? what stops you repeatedly using it? lol)
};

export const Study: ActionImpl = ({ g, me }) => {
  g.addEffect(() => ({
    name: "Study",
    duration: 2,
    affects: [me],
    onAfterDamage({ target, type }) {
      if (this.affects.includes(target) && type === "hp")
        target.sp = Math.min(target.sp + 2, target.maxSP);
    },
  }));
};

export const Swarm = makeAttack({ base: 3, roll: false, origin: "magic" });

export const Sweep = makeAttack({ base: 4, roll: false });

export const Tackle = makeAttack({ base: 0 });

export const Thrust = makeAttack({ base: 3 });

export const Trick = makeAttack({ base: 1, roll: false, type: "camaraderie" });

export const Truce: ActionImpl = ({ g, targets }) => {
  g.addEffect(() => ({
    name: "Truce",
    duration: 2,
    affects: targets,
    onCanAct(e) {
      if (this.affects.includes(e.who) && e.action.tags.includes("attack"))
        e.cancel = true;
    },
  }));
};

export const Unveil: ActionImpl = () => {
  // TODO look at opposing enemy's skill set
};

export const Vanish: ActionImpl = () => {
  // TODO opponents in the three closest spots will give up and find better targets to approach. If the party's fully surrounded or all your allies are down this doesn't do much
};

export const VoxPop: ActionImpl = ({ g, me, targets }) => {
  g.addEffect(() => ({
    name: "Vox Pop",
    duration: 2,
    affects: targets,
    buff: true,
    onCalculateDR(e) {
      if (this.affects.includes(e.who)) e.value += 2;
    },
  }));

  const opponent = g.getOpponent(me);
  if (opponent) {
    const effects = g.getEffectsOn(opponent).filter((e) => e.buff);
    if (effects.length) {
      g.addToLog(`${opponent.name} loses their protections.`);
      g.removeEffectsFrom(effects, opponent);
      g.applyDamage(me, [opponent], g.roll(me), "hp", "normal");
    }
  }
};

export const Wrestle: ActionImpl = () => {
  // TODO Deals 1d6 damage to a target clockwise or counter-clockwise to the user. If damage is 3 or higher, also lowers opponent's Spirit by 1 until the end of the battle.
};
