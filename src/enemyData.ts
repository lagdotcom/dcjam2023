// This file is automatically generated by [yarn kanka]
import * as actions from "./actions";
import Enemy from "./Enemy";

type EnemyData = Pick<
  Enemy,
  | "name"
  | "maxHP"
  | "maxSP"
  | "camaraderie"
  | "determination"
  | "spirit"
  | "dr"
  | "actions"
>;

export const EveScout: EnemyData = {
  name: "Eve Scout",
  maxHP: 10,
  maxSP: 5,
  camaraderie: 3,
  determination: 3,
  spirit: 4,
  dr: 0,
  actions: [actions.Attack, actions.Deflect, actions.Sand, actions.Trick],
};

export const MartialistMullanginan: EnemyData = {
  name: "Martialist (Mullanginan)",
  maxHP: 14,
  maxSP: 4,
  camaraderie: 3,
  determination: 4,
  spirit: 4,
  dr: 0,
  actions: [actions.Attack, actions.Parry, actions.Defy, actions.Flight],
};

export const NettleSage: EnemyData = {
  name: "Nettle Sage",
  maxHP: 12,
  maxSP: 7,
  camaraderie: 2,
  determination: 2,
  spirit: 6,
  dr: 0,
  actions: [actions.Attack, actions.Fortify, actions.Bless, actions.Lash],
};

export const SneedCrawler: EnemyData = {
  name: "Sneed Crawler",
  maxHP: 13,
  maxSP: 4,
  camaraderie: 1,
  determination: 5,
  spirit: 4,
  dr: 0,
  actions: [actions.Attack, actions.Scar, actions.Barb],
};
