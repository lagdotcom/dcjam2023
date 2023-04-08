import { ally } from "../actions";
import Item from "../types/Item";

export const LifeDew: Item = {
  name: "Life Dew",
  type: "Consumable",
  bonus: {},
  action: {
    name: "Scatter",
    tags: ["heal"],
    sp: 1,
    targets: ally(1),
    targetFilter: (c) => c.hp < c.maxHP,
    act({ g, me, targets }) {
      g.heal(me, targets, 3);
    },
  },
};

export const ManaDew: Item = {
  name: "Mana Dew",
  type: "Consumable",
  bonus: {},
  action: {
    name: "Scatter",
    tags: ["heal"],
    sp: 1,
    targets: ally(1),
    targetFilter: (c) => c.sp < c.maxSP,
    act({ g, targets }) {
      for (const target of targets) {
        const newSP = Math.min(target.maxSP, target.sp + 3);
        const gain = newSP - target.maxSP;

        if (gain) {
          target.sp += gain;
          g.addToLog(`${target.name} feels recharged.`);
        }
      }
    },
  },
};

export const Liquor: Item = {
  name: "Liquor",
  type: "Consumable",
  bonus: {},
  action: {
    name: "Drink",
    tags: ["heal"],
    sp: 1,
    targets: ally(1),
    act({ g, targets }) {
      for (const target of targets) {
        // TODO this will crash the game
        target.camaraderie++;
        g.addToLog(`${target.name} feels a little more convivial.`);
      }
    },
  },
};

export const Ration: Item = {
  name: "Ration",
  type: "Consumable",
  bonus: {},
  action: {
    name: "Eat",
    tags: ["heal"],
    sp: 1,
    targets: ally(1),
    act({ g, targets }) {
      for (const target of targets) {
        // TODO this will crash the game
        target.determination++;
        g.addToLog(`${target.name} feels a little more determined.`);
      }
    },
  },
};

export const HolyDew: Item = {
  name: "Holy Dew",
  type: "Consumable",
  bonus: {},
  action: {
    name: "Scatter",
    tags: ["heal"],
    sp: 1,
    targets: ally(1),
    act({ g, targets }) {
      for (const target of targets) {
        // TODO this will crash the game
        target.spirit++;
        g.addToLog(`${target.name} feels their hopes lift.`);
      }
    },
  },
};
