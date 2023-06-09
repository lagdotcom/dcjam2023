import {
  ally,
  Brace,
  DuoStab,
  Flight,
  onlyMe,
  opponents,
  Parry,
} from "../actions";
import { intersection } from "../tools/sets";
import Item from "../types/Item";

export const Penduchaimmer: Item = {
  name: "Penduchaimmer",
  restrict: ["Martialist"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: DuoStab,
};

export const HaringleeKasaya: Item = {
  name: "Haringlee Kasaya",
  restrict: ["Martialist"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: Parry,
};

export const KhakkharaOfGhanju: Item = {
  name: "Khakkhara of Ghanju",
  restrict: ["Martialist"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: {
    name: "Sweep",
    tags: ["attack"],
    sp: 1,
    targets: opponents(3, [0, 1, 3]),
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 4, "hp", "normal");
    },
  },
};

export const Halberdigan: Item = {
  name: "Halberdigan",
  restrict: ["Martialist"],
  slot: "Hand",
  type: "Weapon",
  bonus: { determination: 1 },
  action: {
    name: "Thrust",
    tags: ["attack"],
    sp: 2,
    targets: opponents(1, [0, 1, 3]),
    act({ g, me, targets }) {
      const amount = g.roll(me) + 3;
      g.applyDamage(me, targets, amount, "hp", "normal");
    },
  },
};

export const NundarialVestments: Item = {
  name: "Nundarial Vestments",
  restrict: ["Martialist"],
  slot: "Body",
  type: "Armour",
  bonus: { camaraderie: 1 },
  action: Brace,
};

export const HalflightCowl: Item = {
  name: "Halflight Cowl",
  restrict: ["Martialist"],
  slot: "Body",
  bonus: {},
  action: Flight,
};

export const YamorolMouth: Item = {
  name: "Yamorol's Mouth",
  restrict: ["Martialist"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Mantra",
    tags: [],
    sp: 3,
    targets: ally(1),
    act({ g, me, targets }) {
      me.determination--;
      for (const target of targets) {
        target.determination++;
        g.addToLog(`${me.name} gives everything to inspire ${target.name}.`);
      }
    },
  },
};

export const LoromayHand: Item = {
  name: "Loromay's Hand",
  restrict: ["Martialist"],
  slot: "Special",
  bonus: { spirit: 1 },
  action: {
    name: "Mudra",
    tags: ["buff", "duff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Mudra",
        duration: 2,
        affects: [me],
        onCalculateDamage(e) {
          if (intersection(this.affects, [e.attacker, e.target]).length)
            e.multiplier *= 2;
        },
      }));
    },
  },
};

export const LastEyeOfRaong: Item = {
  name: "Last Eye of Raong",
  restrict: ["Martialist"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Chakra",
    tags: ["buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Chakra",
        duration: 2,
        affects: [me],
        buff: true,
        onRoll(e) {
          if (this.affects.includes(e.who)) e.value = e.size;
        },
      }));
    },
  },
};

Penduchaimmer.lore = `Comprised of two anchors and bound together by threaded fibre plucked from spidokans, these traditional weapons of a martialist are built to stretch and spin much like the hands of a suspended gravity clock. Penduchaimmers are a reminder to all martialists that time will always find it's way back to the living, only in death does it cease.`;

HaringleeKasaya.lore = `Traditional garb worn by martialist masters of Haringlee, they are awarded only to those that spend their lives in devotion to the practices of spirituality. The kasaya symbolizes the wholeness and total mastery of one's self, and one who's inner eye sees only their purpose in life.`;

KhakkharaOfGhanju.lore = `Ghanju is known simply as the first martialist, and the clanging of his khakkhara began and ended many wars. History has stricken his name from most texts, however, as it's said Ghanju practised neither under Cherraphy or Mullanginan's teachings, nor those of any other God.`;

Halberdigan.lore = `In times of peace, halberdigans were simply a tool for picking the fruits of the Ilbombora trees that littered Haringlee's countryside. A devastating fire set by Nightjar's residents and an ensuing drought was punishing enough that farmers began taking up martialism in the name of Cherraphy, in the hope that she'll restore the Ilbombora fields to their former glory.`;

NundarialVestments.lore = `On the day of Nundarial's passing, it's said everyone wore these vestments at Cherraphy's order, to "honour a fool's futility". Historians wager this is in reference to Nundarial spending their lifetime weathering attacks behind closed doors, never striking back, forever without purpose, sleeping in the dulcet cradle of war.`;

HalflightCowl.lore = `Commonly mistaken as a half light cowl. This cowl instead is named after Halfli's Flight, an ancient martialist technique that requires such speed and precision it gives off the appearance that it's user is flying. Though many martialists don this cowl, few are capable of performing Halfli's Flight to it's full potential.`;

YamorolMouth.lore = `In all essence, a beginning. Words spoken aloud, repeated in infinite chanting verse. All words and meanings find a beginning from Yamorol, the primordial birthplace of all things and where even the spirits of Gods are born.`;

LoromayHand.lore = `In all essence, an end. Gestures and actions performed, repeated in infinite repeating motion. All motion and form finds an ending from Loromay, the primordial deathbed of all things and where even the actions of Gods become meaningless.`;

LastEyeOfRaong.lore = `In all essence, sense. Sight to view actions, sound to hear verse. All senses are owed to Raong, whom may only witness the world of Telnoth through this lens so viciously plucked from its being in the primordial age.`;
