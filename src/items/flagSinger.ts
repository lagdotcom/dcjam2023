import { allAllies, ally, oneOpponent } from "../actions";
import { oneOf } from "../tools/rng";
import Item from "../types/Item";

export const CarvingKnife: Item = {
  name: "Carving Knife",
  restrict: ["Flag Singer"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: {
    name: "Scar",
    tags: ["attack"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      const amount = 4;
      g.applyDamage(me, targets, amount, "hp");
      g.applyDamage(me, targets, amount, "hp");
      g.applyDamage(me, targets, amount, "hp");
    },
  },
};

export const SignedCasque: Item = {
  name: "Signed Casque",
  restrict: ["Flag Singer"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
    name: "Cheer",
    tags: ["defence+"],
    sp: 2,
    targets: ally(1),
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Cheer",
        duration: 2,
        affects: targets,
        onCalculateDR(e) {
          if (targets.includes(e.who)) e.value += 3;
        },
      }));
    },
  },
};

export const Fandagger: Item = {
  name: "Fandagger",
  restrict: ["Flag Singer"],
  slot: "Hand",
  type: "Flag",
  bonus: {},
  action: {
    name: "Conduct",
    tags: ["attack"],
    sp: 3,
    targets: oneOpponent,
    act({ g, me, targets }) {
      const dealt = g.applyDamage(me, targets, 6, "hp");
      if (dealt > 0) {
        const ally = oneOf(g.getAllies(me, false));

        if (ally) {
          g.addToLog(`${me.name} conducts ${ally.name}'s next attack.`);
          g.addEffect((destroy) => ({
            name: "Conduct",
            duration: 1,
            affects: [ally],
            onCalculateDamage(e) {
              if (e.attacker === ally) {
                const bonus = g.roll(10);
                e.amount += bonus;
                destroy();
              }
            },
          }));
        }
      }
    },
  },
};

export const Storyscroll: Item = {
  name: "Storyscroll",
  restrict: ["Flag Singer"],
  slot: "Hand",
  type: "Flag",
  bonus: { spirit: 1 },
  action: {
    name: "Bravery",
    tags: ["defence+"],
    sp: 3,
    targets: allAllies,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Bravery",
        duration: 2,
        affects: targets,
        onCalculateDR(e) {
          if (targets.includes(e.who)) e.value += 2;
        },
      }));
    },
  },
};

CarvingKnife.lore = `Not a martial weapon, but rather a craftsman and artist's tool. Having secretly spurned Cherraphy's foul request, this Singer carries this knife as a confirmation that what they did was right.`;

SignedCasque.lore = `A vest made of traditional plaster and adorned in writing with the feelings and wishes of each villager the Singer dares to protect.`;

Fandagger.lore = `Fandaggers are graceful tools of the rogue, to be danced with and to be thrown between acrobats in relay. Held at one end they concertina into painted fans; the other suits the stabbing grip.`;
