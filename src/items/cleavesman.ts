import { oneOpponent, medium, Brace, onlyMe, DuoStab, mild } from "../actions";
import isDefined from "../tools/isDefined";
import { oneOf } from "../tools/rng";
import Item from "../types/Item";

export const GorgothilSword: Item = {
  name: "Gorgothil Sword",
  restrict: ["Cleavesman"],
  slot: "Hand",
  type: "Weapon",
  action: {
    name: "Bash",
    tags: ["attack"],
    sp: 1,
    targets: oneOpponent,
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
  action: Brace,
};

export const Gullark: Item = {
  name: "Gullark",
  restrict: ["Cleavesman"],
  slot: "Hand",
  type: "Shield",
  action: {
    name: "Deflect",
    tags: ["defence+"],
    sp: 2,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Deflect",
        duration: Infinity,
        affects: [me],
        onCalculateDamage(e) {
          if (e.target === me) {
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
  action: DuoStab,
};

export const Varganglia: Item = {
  name: "Varganglia",
  restrict: ["Cleavesman"],
  slot: "Body",
  type: "Armour",
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
          if (e.target === me) {
            const targets = [
              g.getOpponent(me, 0),
              g.getOpponent(me, 1),
              g.getOpponent(me, 3),
            ].filter(isDefined);

            if (targets.length) {
              const target = oneOf(targets);
              const amount = mild(g);

              g.applyDamage(me, [target], amount, "hp");
            }
          }
        },
      }));
    },
  },
};

GorgothilSword.lore = `"""May this steel sing the color of heathen blood.""

This phrase has been uttered ever since Gorgothil was liberated from the thralls of Mullanginan during the Lost War. Gorgothil is now an ever devoted ally, paying their debts by smithing weaponry for all cleavesmen under Cherraphy's wing."`;

Gullark.lore = `Dredged from the Furnace of Ogkh, gullarks are formerly the shells belonging to an ancient creature called a Crim; egg shaped quadrupeds with the face of someone screaming in torment. Many believe their extinction is owed to the over-production of gullarks during the Lost War.`;

Jaegerstock.lore = `Able to stab in a forward and back motion, then a back to forward motion, and once again in a forward and back motion. Wielders often put one foot forward to brace themselves, and those with transcendental minds? They also stab in a forward and back motion.`;

Varganglia.lore = `Armour that's slithered between the creviced wounds that remain after the Long War ended. Varganglia carcasses have become a common attire for cleavesmen, their pelts covered with thick and venomous barbs that erupt from the carcass when struck, making the wearer difficult to strike. `;
