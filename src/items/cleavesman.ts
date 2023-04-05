import {
  Brace,
  DuoStab,
  allAllies,
  oneOpponent,
  onlyMe,
  opponents,
} from "../actions";
import isDefined from "../tools/isDefined";
import { oneOf } from "../tools/rng";
import Item from "../types/Item";

export const GorgothilSword: Item = {
  name: "Gorgothil Sword",
  restrict: ["Cleavesman"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: {
    name: "Bash",
    tags: ["attack"],
    sp: 1,
    targets: oneOpponent,
    act({ g, me, targets }) {
      const amount = g.roll(me) + 4;
      g.applyDamage(me, targets, amount, "hp", "normal");
    },
  },
};

export const Haringplate: Item = {
  name: "Haringplate",
  restrict: ["Cleavesman"],
  slot: "Body",
  type: "Armour",
  bonus: { maxHP: 5 },
  action: Brace,
};

export const Gullark: Item = {
  name: "Gullark",
  restrict: ["Cleavesman"],
  slot: "Hand",
  type: "Shield",
  bonus: { maxHP: 3 },
  action: {
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
            e.amount = 0;
            destroy();
            return;
          }
        },
      }));
    },
  },
};

export const Jaegerstock: Item = {
  name: "Jaegerstock",
  restrict: ["Cleavesman"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: DuoStab,
};

export const Varganglia: Item = {
  name: "Varganglia",
  restrict: ["Cleavesman"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
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

              g.applyDamage(me, [target], amount, "hp", "normal");
            }
          }
        },
      }));
    },
  },
};

export const Gambesar: Item = {
  name: "Gambesar",
  restrict: ["Cleavesman"],
  slot: "Body",
  type: "Armour",
  bonus: { maxHP: 5 },
  action: {
    name: "Tackle",
    tags: ["attack"],
    sp: 3,
    targets: opponents(1, [1, 3]),
    act({ g, me, targets }) {
      const amount = g.roll(me);
      g.applyDamage(me, targets, amount, "hp", "normal");
    },
  },
};

export const ChivalrousMantle: Item = {
  name: "Chivalrous Mantle",
  restrict: ["Cleavesman"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Honour",
    tags: [],
    sp: 2,
    targets: allAllies,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Honour",
        duration: 2,
        affects: targets,
        buff: true,
        onCalculateDamage(e) {
          if (this.affects.includes(e.target) && e.type === "determination")
            e.amount = 0;
        },
      }));
    },
  },
};

GorgothilSword.lore = `"""May this steel sing the color of heathen blood.""

This phrase has been uttered ever since Gorgothil was liberated from the thralls of Mullanginan during the Lost War. Gorgothil is now an ever devoted ally, paying their debts by smithing weaponry for all cleavesmen under Cherraphy's wing."`;

Gullark.lore = `Dredged from the Furnace of Ogkh, gullarks are formerly the shells belonging to an ancient creature called a Crim; egg shaped quadrupeds with the face of someone screaming in torment. Many believe their extinction is owed to the over-production of gullarks during the Lost War.`;

Jaegerstock.lore = `Able to stab in a forward and back motion, then a back to forward motion, and once again in a forward and back motion. Wielders often put one foot forward to brace themselves, and those with transcendental minds? They also stab in a forward and back motion.`;

Varganglia.lore = `Armour that's slithered forth from Telnoth's scars after the Long War ended. Varganglia carcasses have become a common attire for cleavesmen, their pelts covered with thick and venomous barbs that erupt from the carcass when struck, making the wearer difficult to strike.`;

Gambesar.lore = `"Enchanted by Cherraphy's highest order of sages, gambesars are awarded only to cleavesman that return from battle after sustaining tremendous injury. It's said that wearing one allows the user to shift the environment around them, appearing multiple steps from where they first started in just an instant.`;
