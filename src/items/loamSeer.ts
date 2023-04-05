import { Bless, oneOpponent } from "../actions";
import Item from "../types/Item";

export const Cornucopia: Item = {
  name: "Cornucopia",
  restrict: ["Loam Seer"],
  slot: "Hand",
  type: "Catalyst",
  bonus: {},
  action: Bless,
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

Cornucopia.lore = `The proverbial horn of plenty, or rather a replica crafted by the artists of Haringlee, then bestowed by its priests with a magickal knack for exuding a sweet restorative nectar.`;

JacketAndRucksack.lore = `Clothes and containers of simple leather. Sensible wear for foragers and druidic types; not truly intended for fighting.`;
