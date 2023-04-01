import Item from "./types/Item";
import random from "./tools/random";

export const MartialHammer: Item = {
  name: "Martial Hammer",
  className: "Paladin",
  slot: "Weapon",
  action: {
    name: "Attack",
    sp: 2,
    targets: "Opponent",
    act({ g, targets, me }) {
      const bonus = me.attacksInARow;
      const amount = random(16 + bonus, 9);
      g.applyDamage(me, targets, amount, "hp");
    },
  },
};

export const BannerOfHaringlee: Item = {
  name: "The Banner of Haringlee",
  className: "Bard",
  slot: "Special",
  dr: 1,
  action: {
    name: "Reassurance",
    sp: 0,
    targets: "AllParty",
    act({ g, targets }) {
      g.addEffect({
        name: "Reassurance",
        duration: 1,
        affects: targets,
        onCalculateDamage(e) {
          if (
            targets.includes(e.target) &&
            ["camaraderie", "determination"].includes(e.type)
          ) {
            // TODO feedback?
            e.amount /= 2;
          }
        },
      });
    },
  },
};

export const IronGorget: Item = {
  name: "Iron Gorget",
  className: "Knight",
  slot: "Armour",
  dr: 2,
  action: {
    name: "Steel Yourself",
    sp: 2,
    targets: "Self",
    act({ g, targets }) {
      g.addEffect({
        name: "Steel Yourself",
        duration: 1,
        affects: targets,
        onCalculateDR(e) {
          if (targets.includes(e.who)) e.dr *= 2;
        },
      });
    },
  },
};
