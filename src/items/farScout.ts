import { Sand, oneOpponent, opponents } from "../actions";
import Item from "../types/Item";

export const BoltSlinger: Item = {
  name: "Bolt Slinger",
  restrict: ["Far Scout"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: {
    name: "Arrow",
    tags: ["attack"],
    sp: 3,
    targets: opponents(1, [1, 2, 3]),
    act({ g, me, targets }) {
      const amount = g.roll(me) + 2;
      g.applyDamage(me, targets, amount, "hp", "normal");
    },
  },
};

export const AdaloaxPelt: Item = {
  name: "Adaloax Pelt",
  restrict: ["Far Scout"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
    name: "Bind",
    tags: ["duff"],
    sp: 4,
    targets: oneOpponent,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Bind",
        duration: 2,
        affects: targets,
        onCanAct(e) {
          if (this.affects.includes(e.who)) e.cancel = true;
        },
      }));
    },
  },
};

export const Haversack: Item = {
  name: "Haversack",
  restrict: ["Far Scout"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: Sand,
};

export const PryingPoleaxe: Item = {
  name: "Prying Poleaxe",
  restrict: ["Far Scout"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: {
    name: "Gouge",
    tags: ["attack", "duff"],
    sp: 5,
    targets: oneOpponent,
    act({ g, me, targets }) {
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
    },
  },
};

BoltSlinger.lore = `A string and stick combo coming in many shapes and sizes. All with the express purpose of expelling sharp objects at blinding speeds. Any far scout worth their salt still opts for a retro-styled bolt slinger; clunky mechanisms and needless gadgets serve only to hinder one's own skills.`;

AdaloaxPelt.lore = `Traditional hunter-gatherer and scouting attire, adaloax pelts are often sold and coupled with a set of bolas for trapping prey. The rest of the adaloax is divided up into portions of meat and sold at market value, often a single adaloax can produce upwards of three pelts and enough meat to keep multiple people fed.`;

Haversack.lore = `People, creatures, automata and constructs of all kinds find different use for a haversack, but the sand pouch remains the same. Considered a coward's weapon by many, the remainder would disagree as sometimes flight is the only response to a fight. A hasty retreat is far more preferable than a future as carrion.`;
