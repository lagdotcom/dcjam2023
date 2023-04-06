import eveScoutImage from "../res/atlas/eveScout.png";
import eveScoutJson from "../res/atlas/eveScout.json";
import martialistImage from "../res/atlas/martialist.png";
import martialistJson from "../res/atlas/martialist.json";
import nettleSageImage from "../res/atlas/nettleSage.png";
import nettleSageJson from "../res/atlas/nettleSage.json";
import sneedCrawlerImage from "../res/atlas/sneedCrawler.png";
import sneedCrawlerJson from "../res/atlas/sneedCrawler.json";

import mapDScript from "../res/map.dscript";
import test1Image from "../res/atlas/test1.png";
import test1Json from "../res/atlas/test1.json";

const Resources: Record<string, string> = {
  "test1.png": test1Image,
  "test1.json": test1Json,
  "map.dscript": mapDScript,

  "eveScout.png": eveScoutImage,
  "eveScout.json": eveScoutJson,
  "martialist.png": martialistImage,
  "martialist.json": martialistJson,
  "nettleSage.png": nettleSageImage,
  "nettleSage.json": nettleSageJson,
  "sneedCrawler.png": sneedCrawlerImage,
  "sneedCrawler.json": sneedCrawlerJson,
};

export function getResourceURL(id: string) {
  const value = Resources[id];
  if (!value) throw new Error(`Invalid resource ID: ${id}`);
  return value;
}
