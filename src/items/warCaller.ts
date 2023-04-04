import { onlyMe } from "../actions";
import Item from "../types/Item";

export const OwlSkull: Item = {
  name: "Owl's Skull",
  restrict: ["War Caller"],
  slot: "Hand",
  type: "Catalyst",
  action: {
    name: "Defy",
    tags: ["defence+"],
    sp: 3,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Defy",
        duration: 2,
        affects: [me],
        onAfterDamage({ target, attacker }) {
          if (target !== me) return;

          g.addToLog(`${me.name} stuns ${attacker.name} with their defiance!`);
          g.addEffect(() => ({
            name: "Defied",
            duration: 1,
            affects: [attacker],
            onCanAct(e) {
              if (e.who === attacker) e.cancel = true;
            },
          }));
        },
      }));
    },
  },
};

export const IronFullcase: Item = {
  name: "Iron Fullcase",
  restrict: ["War Caller"],
  slot: "Body",
  type: "Armour",
  action: {
    name: "Endure",
    tags: ["defence+"],
    sp: 2,
    targets: onlyMe,
    act({ g, me }) {
      g.addEffect(() => ({
        name: "Endure",
        duration: 2,
        affects: [me],
        onCalculateDR(e) {
          if (e.who === me) e.value += 2;
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
            if (e.who === opposite) e.value -= 2;
          },
        }));
      }
    },
  },
};
