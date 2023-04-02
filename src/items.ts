import Item from "./types/Item";
import { generateAttack } from "./actions";

// TODO STARTING ITEMS
export const Dagger: Item = {
  name: "Dagger",
  className: "Bard",
  slot: "Weapon",
  action: generateAttack(1, 4),
};
export const Axe: Item = {
  name: "Axe",
  className: "Brawler",
  slot: "Weapon",
  action: generateAttack(1, 10),
};
export const Sword: Item = {
  name: "Sword",
  className: "Knight",
  slot: "Weapon",
  action: generateAttack(1, 8),
};
export const Staff: Item = {
  name: "Staff",
  className: "Mage",
  slot: "Weapon",
  action: generateAttack(1, 4),
};
export const Mace: Item = {
  name: "Mace",
  className: "Paladin",
  slot: "Weapon",
  action: generateAttack(1, 8),
};
export const Club: Item = {
  name: "Club",
  className: "Thief",
  slot: "Weapon",
  action: generateAttack(1, 6),
};

export const MartialHammer: Item = {
  name: "Martial Hammer",
  className: "Paladin",
  slot: "Weapon",
  action: generateAttack(9, 16),
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
