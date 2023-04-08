import { Bravery, Defy, Scar, allAllies, ally, oneOpponent } from "../actions";
import { niceList, pluralS } from "../tools/lists";
import { oneOf } from "../tools/rng";
import Item from "../types/Item";

export const CarvingKnife: Item = {
  name: "Carving Knife",
  restrict: ["Flag Singer"],
  slot: "Hand",
  type: "Weapon",
  bonus: {},
  action: Scar,
};

export const SignedCasque: Item = {
  name: "Signed Casque",
  restrict: ["Flag Singer"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
    name: "Cheer",
    tags: ["buff"],
    sp: 2,
    targets: ally(1),
    act({ g, targets }) {
      g.addToLog(
        `${niceList(targets.map((x) => x.name))} feel${pluralS(
          targets
        )} more protected.`
      );
      g.addEffect(() => ({
        name: "Cheer",
        duration: 2,
        affects: targets,
        buff: true,
        onCalculateDR(e) {
          if (this.affects.includes(e.who)) e.value += 3;
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
      const dealt = g.applyDamage(me, targets, 6, "hp", "normal");
      if (dealt > 0) {
        const ally = oneOf(g.getAllies(me, false));

        if (ally) {
          g.addToLog(`${me.name} conducts ${ally.name}'s next attack.`);
          g.addEffect((destroy) => ({
            name: "Conduct",
            duration: 1,
            affects: [ally],
            buff: true,
            onCalculateDamage(e) {
              if (this.affects.includes(e.attacker)) {
                const bonus = g.roll(me);
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
  action: Bravery,
};

export const DivaDress: Item = {
  name: "Diva's Dress",
  restrict: ["Flag Singer"],
  slot: "Body",
  type: "Armour",
  bonus: { spirit: 1 },
  action: Defy,
};

export const GrowlingCollar: Item = {
  name: "Growling Collar",
  restrict: ["Flag Singer"],
  slot: "Body",
  type: "Armour",
  bonus: {},
  action: {
    name: "Vox Pop",
    tags: ["duff"],
    sp: 4,
    targets: allAllies,
    act({ g, me, targets }) {
      g.addEffect(() => ({
        name: "Vox Pop",
        duration: 2,
        affects: targets,
        buff: true,
        onCalculateDR(e) {
          if (this.affects.includes(e.who)) e.value += 2;
        },
      }));

      const opponent = g.getOpponent(me);
      if (opponent) {
        const effects = g.getEffectsOn(opponent).filter((e) => e.buff);
        if (effects.length) {
          g.addToLog(`${opponent.name} loses their protections.`);
          g.removeEffectsFrom(effects, opponent);
          g.applyDamage(me, [opponent], g.roll(me), "hp", "normal");
        }
      }
    },
  },
};

export const FolkHarp: Item = {
  name: "Folk Harp",
  restrict: ["Flag Singer"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Muse",
    tags: ["buff"],
    sp: 2,
    targets: allAllies,
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Muse",
        duration: 2,
        affects: targets,
        onCalculateDamage(e) {
          if (this.affects.includes(e.attacker))
            e.amount += e.attacker.camaraderie;
        },
      }));
    },
  },
};

export const CatFacedMasquerade: Item = {
  name: "Cat-faced Masquerade",
  restrict: ["Flag Singer"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Inspire",
    tags: ["buff"],
    sp: 4,
    targets: allAllies,
    act({ g, me, targets }) {
      g.addEffect(() => ({
        name: "Inspire",
        duration: 2,
        affects: targets,
        onCalculateDamage(e) {
          if (this.affects.includes(e.target)) {
            e.multiplier = 0;
            g.addToLog(`${e.attacker.name} faces backlash!`);
            g.applyDamage(me, [e.attacker], g.roll(me), "hp", "magic");
          }
        },
      }));
    },
  },
};

export const WindmillRobe: Item = {
  name: "Windmill Robe",
  restrict: ["Flag Singer"],
  slot: "Special",
  bonus: { dr: 1 },
  action: {
    name: "Unveil",
    tags: [],
    sp: 1,
    targets: oneOpponent,
    act() {
      // TODO look at opposing enemy's skills et
    },
  },
};

CarvingKnife.lore = `Not a martial weapon, but rather a craftsman and artist's tool. Having secretly spurned Cherraphy's foul request, this Singer carries this knife as a confirmation that what they did was right.`;

SignedCasque.lore = `A vest made of traditional plaster and adorned in writing with the feelings and wishes of each villager the Singer dares to protect.`;

Fandagger.lore = `Fandaggers are graceful tools of the rogue, to be danced with and to be thrown between acrobats in relay. Held at one end they concertina into painted fans; the other suits the stabbing grip.`;

Storyscroll.lore = `A furled tapestry illustrated with a brief history of Haringlee myth. When the Flag Singer whirls it about them as though dancing with ribbons, their comrades are enriched by the spirit of the fantasies it depicts.`;

DivaDress.lore = `Few dare interfere with the performance of a Singer so dressed: these glittering magic garments dazzle any foolish enough to try! All may wear the Diva's Dress so long as it is earned by skill; gender matters not to the craft.`;

GrowlingCollar.lore = `A mechanical amplifier pressed tightly to the skin of the throat, held in place by a black leather collar. When you speak, it roars.`;

FolkHarp.lore = `An ancient traditional instrument, strings of animal innards sprung over a tune-measured wooden frame to create a playable musical scale. Can be plucked melodically, or strummed to produce a glistening, harmonic, rain-like sound.`;

CatFacedMasquerade.lore = `A mask that lends its wearer a mocking air, or one of being deeply unimpressed. Turning this disdainful expression on an enemy reassures your allies of their superiority; a simple means of encouragement in complicated times.`;

WindmillRobe.lore = `A pale blue robe with ultra-long sleeves, slung with diamond-shaped hanging sheets of fabric. Psychic expertise and practise allows you to manipulate these flags and perform intricate displays without so much as moving your arms; the most complicated dances can have a mesmerizing effect.`;
