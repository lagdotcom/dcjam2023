import { Bless, Defy, oneOpponent, onlyMe, opponents } from "../actions";
import { rotate } from "../tools/geometry";
import { intersection } from "../tools/sets";
import Item from "../types/Item";

export const OwlSkull: Item = {
  name: "Owl's Skull",
  restrict: ["War Caller"],
  slot: "Hand",
  type: "Catalyst",
  bonus: {},
  action: Defy,
};

export const IronFullcase: Item = {
  name: "Iron Fullcase",
  restrict: ["War Caller"],
  slot: "Body",
  type: "Armour",
  bonus: { dr: 1 },
  action: {
    name: "Endure",
    tags: ["buff"],
    sp: 2,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Endure",
        duration: 2,
        affects: [me],
        buff: true,
        onCalculateDR(e) {
          if (this.affects.includes(e.who)) e.value += 2;
        },
      }));

      const opposite = g.getOpponent(me);
      if (opposite) {
        g.addToLog(
          `${opposite.name} withers in the face of ${me.name}'s endurance!`
        );
        g.addEffect(() => ({
          name: "Endured",
          duration: 2,
          affects: [opposite],
          onCalculateDetermination(e) {
            if (this.affects.includes(e.who)) e.value -= 2;
          },
        }));
      }
    },
  },
};

export const PolishedArenaShield: Item = {
  name: "Polished Arena-Shield",
  restrict: ["War Caller"],
  slot: "Hand",
  type: "Shield",
  bonus: { dr: 1 },
  action: {
    name: "Pose",
    tags: ["movement"],
    sp: 2,
    targets: opponents(),
    act({ g, me }) {
      const front = g.getPosition(me).dir;
      const right = rotate(front, 1);
      const back = rotate(front, 2);
      const left = rotate(front, 3);

      const frontIsEmpty = () => !g.getOpponent(me);
      const rightIsEmpty = () => !g.getOpponent(me, 1);
      const backIsEmpty = () => !g.getOpponent(me, 2);
      const leftIsEmpty = () => !g.getOpponent(me, 3);

      if (frontIsEmpty()) {
        if (!leftIsEmpty()) {
          g.moveEnemy(left, front);
        } else if (!rightIsEmpty()) {
          g.moveEnemy(right, front);
        }
      }

      if (!backIsEmpty) {
        if (leftIsEmpty()) {
          g.moveEnemy(back, left);
        } else if (rightIsEmpty()) {
          g.moveEnemy(back, right);
        }
      }
    },
  },
};

export const BrassHeartInsignia: Item = {
  name: "Brass Heart Insignia",
  restrict: ["War Caller"],
  slot: "Hand",
  type: "Catalyst",
  bonus: { dr: 1 },
  action: Bless,
};

export const HairShirt: Item = {
  name: "Hair Shirt",
  restrict: ["War Caller"],
  slot: "Body",
  type: "Armour",
  bonus: { determination: 1 },
  action: {
    name: "Kneel",
    tags: ["duff"],
    sp: 0,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Kneel",
        duration: 2,
        affects: [me],
        onCalculateDR(e) {
          if (this.affects.includes(e.who)) e.value = 0;
        },
      }));
    },
  },
};

export const PlatesOfWhite: Item = {
  name: "Plates of White, Brass and Gold",
  restrict: ["War Caller"],
  slot: "Body",
  type: "Armour",
  bonus: { dr: 3 },
  action: {
    name: "Gleam",
    tags: ["buff"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect((destroy) => ({
        name: "Gleam",
        duration: 2,
        affects: [me],
        onBeforeAction(e) {
          if (
            intersection(this.affects, e.targets).length &&
            e.action.tags.includes("spell")
          ) {
            e.cancel = true;
            g.addToLog(`The gleam disrupts the spell.`);
            destroy();
            return;
          }
        },
      }));
    },
  },
};

export const SternMask: Item = {
  name: "The Stern Mask",
  restrict: ["War Caller"],
  slot: "Special",
  bonus: { determination: 1 },
  action: {
    name: "Ram",
    tags: ["attack"],
    sp: 4,
    targets: oneOpponent,
    act({ g, me, targets }) {
      g.applyDamage(me, targets, 6, "hp", "normal");
      g.applyDamage(me, targets, 1, "camaraderie", "normal");
      g.applyDamage(me, targets, 6, "hp", "normal");
      g.applyDamage(me, targets, 1, "camaraderie", "normal");

      for (const target of targets) {
        if (target.camaraderie <= 0)
          g.applyDamage(me, [target], g.roll(me), "hp", "normal");
      }
    },
  },
};

export const CherClaspeGauntlet: Item = {
  name: "Cher-claspe Gauntlet",
  restrict: ["War Caller"],
  slot: "Special",
  bonus: {},
  action: {
    name: "Smash",
    tags: ["attack"],
    sp: 3,
    x: true,
    targets: oneOpponent,
    act({ g, me, targets, x }) {
      const magnitude = x + Math.floor((me.hp / me.maxHP) * 8);
      g.applyDamage(me, targets, magnitude * 4, "hp", "normal");
    },
  },
};

export const SaintGong: Item = {
  name: "Saint's Gong",
  restrict: ["War Caller"],
  slot: "Special",
  bonus: { maxSP: 1 },
  action: {
    name: "Truce",
    tags: ["counter"],
    sp: 6,
    targets: { type: "enemy" },
    act({ g, targets }) {
      g.addEffect(() => ({
        name: "Truce",
        duration: 2,
        affects: targets,
        onCanAct(e) {
          if (this.affects.includes(e.who) && e.action.tags.includes("attack"))
            e.cancel = true;
        },
      }));
    },
  },
};

OwlSkull.lore = `All experienced knights know that menace lies mainly in the eyes, whether it be communicated via a glare through the slits of a full helmet or by a wild, haunting stare. War Callers find common ground with the owls that hunt their forests and sometimes try to tame them as familiars, as others do falcons in different realms.`;

IronFullcase.lore = `A stiff layer of iron to protect the innards, sleeveless to allow flexibility in one's arms. Arena veterans favour such gear, goading their opponents with weapons brandished wildly, their chest remaining an impossible target to hit.`;

PolishedArenaShield.lore = `As well as being a serviceable shield, this example has a percussive quality; when beaten with a club it resounds as a bell.`;

BrassHeartInsignia.lore = `War Caller iconography is not to be shown to anyone who has studied medicine; the Brass Heart signifies that the will to heal one's self comes from the chest, always thrust proudly forwards to receive terrible blows. (Two weeks in bed and a poultice applied thrice daily notwithstanding.)`;

HairShirt.lore = `A garment for penitents: the unwelcome itching generated by its wiry goat-hair lining must be surpassed through strength of will.`;

PlatesOfWhite.lore = `An impressive suit of armour, decorated in the colours that the Crusaders of Cherraphy favour. Despite the lavish attention to presentation, it is no ceremonial costume: beneath the inlaid discs of fine metal, steel awaits to contest any oncoming blade.`;

SternMask.lore = `A full helm, decorated in paint and fine metalwork to resemble the disdainful face of a saint. Each headbutt it delivers communicates severe chastisement.`;

CherClaspeGauntlet.lore = `A pair of iron gauntlets ensorcelled with a modest enchantment; upon the command of a priest, these matching metal gloves each lock into the shape of a fist and cannot be undone by the bearer; a stricture that War Callers willingly bear, that it may sustain their resolve and dismiss their idle habits.`;

SaintGong.lore = `A brass percussive disc mounted on a seven foot banner-pole and hung from hinge-chains, letting it swing freely enough that its shuddering surface rings clean. Most effective when tuned to the frequency of a chosen knight's bellows, allowing it to crash loudly in accompaniment with each war cry.`;
