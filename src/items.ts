import Item from "./types/Item";
import Game from "./types/Game";

const mild = (g: Game) => g.roll(6) + 2;
const medium = (g: Game) => g.roll(8) + 3;

export const Penduchaimmer: Item = {
  name: "Penduchaimmer",
  restrict: ["Martialist"],
  slot: "Hand",
  type: "Weapon",
  action: {
    name: "DuoStab",
    tags: ["attack"],
    sp: 3,
    targets: "Opponent",
    act({ g, me, targets }) {
      const amount = mild(g);
      g.applyDamage(me, targets, amount, "hp");

      const opposite = g.getOpponent(me, 2);
      if (opposite) g.applyDamage(me, [opposite], amount / 2, "hp");
    },
  },
};

export const HaringleeKasaya: Item = {
  name: "Haringlee Kasaya",
  restrict: ["Martialist"],
  slot: "Body",
  type: "Armour",
  action: {
    name: "Parry",
    tags: ["counter", "defence"],
    sp: 3,
    targets: "Self",
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Parry",
        duration: Infinity,
        affects: [me],
        onBeforeAction(e) {
          if (e.targets.includes(me) && e.action.tags.includes("attack")) {
            g.addToLog(`${me.name} counters!`);

            const amount = mild(g);
            g.applyDamage(me, [e.attacker], amount, "hp");
            destroy();
            e.cancel = true;
            return;
          }
        },
      }));
    },
  },
};

export const GorgothilSword: Item = {
  name: "Gorgothil Sword",
  restrict: ["Cleavesman"],
  slot: "Hand",
  type: "Weapon",
  action: {
    name: "Bash",
    tags: ["attack"],
    sp: 1,
    targets: "Opponent",
    act({ g, me, targets }) {
      const amount = medium(g);
      g.applyDamage(me, targets, amount, "hp");
    },
  },
};

export const Haringplate: Item = {
  name: "Haringplate",
  restrict: ["Cleavesman"],
  slot: "Body",
  type: "Armour",
  action: {
    name: "Brace",
    tags: ["defence"],
    sp: 3,
    targets: "Self",
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
  },
};

export const OwlSkull: Item = {
  name: "Owl's Skull",
  restrict: ["War Caller"],
  slot: "Hand",
  type: "Catalyst",
  action: {
    name: "Defy",
    tags: ["defence"],
    sp: 3,
    targets: "Self",
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Defy",
        duration: 2,
        affects: [me],
        onAfterDamage({ target, attacker }) {
          g.addToLog(`${me.name} stuns ${attacker.name} with their defiance!`);

          if (target === me)
            g.addEffect(() => ({
              name: "Defied",
              duration: 1,
              affects: [attacker],
              onCanAct(e) {
                if (e.who === attacker) e.cancel = true;
              },
            }));
        },
      }));
    },
  },
};

export const IronFullcase: Item = {
  name: "Iron Fullcase",
  restrict: ["War Caller"],
  slot: "Body",
  type: "Armour",
  action: {
    name: "Endure",
    tags: ["defence"],
    sp: 2,
    targets: "Self",
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Endure",
        duration: 2,
        affects: [me],
        onCalculateDR(e) {
          if (e.who === me) e.value += 2;
        },
      }));

      const opposite = g.getOpponent(me);
      if (opposite) {
        g.addToLog(
          `${opposite.name} withers in the face of ${me.name}'s endurance!`
        );
        g.addEffect(() => ({
          name: "Endured",
          duration: 2,
          affects: [opposite],
          onCalculateDetermination(e) {
            if (e.who === opposite) e.value -= 2;
          },
        }));
      }
    },
  },
};

export const Cornucopia: Item = {
  name: "Cornucopia",
  restrict: ["Loam Seer"],
  slot: "Hand",
  type: "Catalyst",
  action: {
    name: "Bless",
    tags: ["heal"],
    sp: 1,
    targets: "OneAlly",
    act({ g, me, targets }) {
      const amount = mild(g);
      g.heal(me, targets, amount);
    },
  },
};

export const JacketAndRucksack: Item = {
  name: "Jacket and Rucksack",
  restrict: ["Loam Seer"],
  slot: "Body",
  type: "Armour",
  action: {
    name: "Search",
    tags: [],
    sp: 4,
    targets: "Opponent",
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Search",
        duration: Infinity,
        affects: targets,
        // TODO: enemy is more likely to drop items
      }));
    },
  },
};
