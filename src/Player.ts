import { EndTurn } from "./actionImplementations";
import { Attack } from "./actions";
import classes from "./classes";
import Engine from "./Engine";
import { getItem } from "./items";
import removeItem from "./tools/arrays";
import isDefined from "./tools/isDefined";
import { ClassName } from "./types/ClassName";
import CombatAction from "./types/CombatAction";
import Combatant, { AttackableStat, BoostableStat } from "./types/Combatant";
import {
  ActionName,
  CombatantName,
  HitPoints,
  ItemName,
  SkillName,
  SkillPoints,
} from "./types/flavours";
import Item from "./types/Item";

function getBaseStat(
  className: ClassName,
  stat: AttackableStat,
  bonusStat?: AttackableStat,
  bonusIfTrue = 1,
) {
  return classes[className][stat] + (bonusStat === stat ? bonusIfTrue : 0);
}

export type PlayerEquipmentSlot = "LeftHand" | "RightHand" | "Body" | "Special";

export interface SerializedPlayer {
  name: CombatantName;
  className: ClassName;
  hp: HitPoints;
  sp: SkillPoints;
  LeftHand?: ItemName;
  RightHand?: ItemName;
  Body?: ItemName;
  Special?: ItemName;
}

export const endTurnAction: CombatAction = {
  name: "End Turn",
  tags: [],
  sp: 0,
  targets: { type: "ally" },
  act: EndTurn,
};

export default class Player implements Combatant {
  name: CombatantName;
  isPC: true;
  hp: HitPoints;
  sp: SkillPoints;
  attacksInARow: number;
  usedThisTurn: Set<ActionName>;
  baseMaxHP: HitPoints;
  baseMaxSP: SkillPoints;
  baseCamaraderie: number;
  baseDetermination: number;
  baseSpirit: number;
  skill: SkillName;

  LeftHand?: Item;
  RightHand?: Item;
  Body?: Item;
  Special?: Item;

  constructor(
    public g: Engine,
    public className: ClassName,
    bonus?: AttackableStat,
    items = classes[className].items,
  ) {
    this.name = classes[className].name;
    this.isPC = true;
    this.attacksInARow = 0;
    this.usedThisTurn = new Set();
    this.skill = classes[className].skill;

    for (const item of items) {
      if (item.slot) this.equip(item);
      else g.inventory.push(item);
    }

    this.baseMaxHP = getBaseStat(className, "hp", bonus, 5);
    this.baseMaxSP = getBaseStat(className, "sp", bonus);
    this.baseCamaraderie = getBaseStat(className, "camaraderie", bonus);
    this.baseDetermination = getBaseStat(className, "determination", bonus);
    this.baseSpirit = getBaseStat(className, "spirit", bonus);
    this.hp = this.maxHP;
    this.sp = Math.min(this.baseMaxSP, this.spirit);
  }

  get alive() {
    return this.hp > 0;
  }

  get equipment() {
    return [this.LeftHand, this.RightHand, this.Body, this.Special].filter(
      isDefined,
    );
  }

  static load(g: Engine, data: SerializedPlayer): Player {
    const p = new Player(g, data.className);
    p.name = data.name;
    p.hp = data.hp;
    p.sp = data.sp;
    p.LeftHand = getItem(data.LeftHand);
    p.RightHand = getItem(data.RightHand);
    p.Body = getItem(data.Body);
    p.Special = getItem(data.Special);

    return p;
  }

  serialize(): SerializedPlayer {
    const { name, className, hp, sp, LeftHand, RightHand, Body, Special } =
      this;
    return {
      name,
      className,
      hp,
      sp,
      LeftHand: LeftHand?.name,
      RightHand: RightHand?.name,
      Body: Body?.name,
      Special: Special?.name,
    };
  }

  getStat(stat: BoostableStat, base = 0): number {
    let value = base;

    for (const item of this.equipment) {
      value += item?.bonus[stat] ?? 0;
    }

    return this.g.applyStatModifiers(this, stat, value);
  }

  getBaseStat(stat: BoostableStat): number {
    switch (stat) {
      case "dr":
        return 0;
      case "maxHP":
        return this.baseMaxHP;
      case "maxSP":
        return this.baseMaxSP;
      case "camaraderie":
        return this.baseCamaraderie;
      case "determination":
        return this.baseDetermination;
      case "spirit":
        return this.baseSpirit;
    }
  }

  get maxHP(): HitPoints {
    return this.getStat("maxHP", this.baseMaxHP);
  }
  get maxSP(): SkillPoints {
    return this.getStat("maxSP", this.baseMaxSP);
  }

  get dr(): HitPoints {
    return this.getStat("dr", 0);
  }

  get camaraderie() {
    return this.getStat("camaraderie", this.baseCamaraderie);
  }
  get determination() {
    return this.getStat("determination", this.baseDetermination);
  }
  get spirit() {
    return this.getStat("spirit", this.baseSpirit);
  }

  get actions() {
    return Array.from(this.equipment.values())
      .map((i) => i.action)
      .concat(Attack, endTurnAction);
  }

  get canMove() {
    return !this.alive || this.sp > 0;
  }

  move() {
    if (this.alive) this.sp--;
  }

  canEquip(item: Item) {
    if (!item.slot) return false;
    if (item.restrict && !item.restrict.includes(this.className)) return false;

    return true;
  }

  equip(item: Item) {
    if (!this.canEquip(item)) return;
    removeItem(this.g.inventory, item);

    if (item.slot === "Hand") {
      if (this.LeftHand && this.RightHand) {
        this.g.inventory.push(this.LeftHand);
        this.LeftHand = this.RightHand;
        this.RightHand = item;
      } else if (this.LeftHand) this.RightHand = item;
      else this.LeftHand = item;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const old = this[item.slot!];
      if (old) this.g.inventory.push(old);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this[item.slot!] = item;
    }

    this.checkMaxOverflow();
  }

  remove(slot: PlayerEquipmentSlot) {
    const item = this[slot];

    if (item) {
      this.g.inventory.push(item);
      this[slot] = undefined;
      this.checkMaxOverflow();
    }
  }

  checkMaxOverflow() {
    this.hp = Math.min(this.hp, this.maxHP);
    this.sp = Math.min(this.sp, this.maxSP);
  }
}
