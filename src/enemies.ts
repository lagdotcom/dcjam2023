import * as enemyData from "./enemyData";
import CombatAction from "./types/CombatAction";
import Combatant from "./types/Combatant";
import { AtlasLayerID, Milliseconds } from "./types/flavours";

export interface EnemyAnimation {
  delay: Milliseconds;
  frames: AtlasLayerID[];
}

export type EnemyTemplate = Pick<
  Combatant,
  "name" | "maxHP" | "maxSP" | "camaraderie" | "determination" | "spirit" | "dr"
> & {
  actions: CombatAction[];
  object: AtlasLayerID;
  animation: EnemyAnimation;
};

export const EnemyObjects = {
  eNettleSage: 100,
  eEveScout: 110,
  eSneedCrawler: 120,
  eMullanginanMartialist: 130,
  oNettleSage: 100,
  oEveScout: 110,
  oSneedCrawler: 120,
  oMullanginanMartialist: 130,
} as const;

export const allEnemies = {
  "Eve Scout": {
    ...enemyData.EveScout,
    object: EnemyObjects.eEveScout,
    animation: { delay: 300, frames: [110, 111, 112, 113] },
  },
  "Sneed Crawler": {
    ...enemyData.SneedCrawler,
    object: EnemyObjects.eSneedCrawler,
    animation: { delay: 300, frames: [120, 121, 122, 123, 124, 125] },
  },
  "Mullanginan Martialist": {
    ...enemyData.MartialistMullanginan,
    name: "Mullanginan Martialist",
    object: EnemyObjects.eMullanginanMartialist,
    animation: { delay: 300, frames: [130, 131, 130, 132] },
  },
  "Nettle Sage": {
    ...enemyData.NettleSage,
    object: EnemyObjects.eNettleSage,
    animation: { delay: 300, frames: [100, 101, 100, 102] },
  },
} satisfies Record<string, EnemyTemplate>;
export type EnemyName = keyof typeof allEnemies;
const EnemyNames = Object.keys(allEnemies);

export function isEnemyName(name: string): name is EnemyName {
  return EnemyNames.includes(name);
}
