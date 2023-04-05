import { ally, mild, oneOpponent } from "../actions";
import Item from "../types/Item";

export const Cornucopia: Item = {
  name: "Cornucopia",
  restrict: ["Loam Seer"],
  slot: "Hand",
  type: "Catalyst",
  bonus: {},
  action: {
    name: "Bless",
    tags: ["heal"],
    sp: 1,
    targets: ally(1),
    targetFilter: (c) => c.hp < c.maxHP,
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
  bonus: {},
  action: {
    name: "Search",
    tags: [],
    sp: 4,
    targets: oneOpponent,
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
