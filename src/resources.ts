import eveScoutJson from "../res/atlas/eveScout.json";
import eveScoutImage from "../res/atlas/eveScout.png";
import flatsJson from "../res/atlas/flats.json";
import flatsImage from "../res/atlas/flats.png";
import martialistJson from "../res/atlas/martialist.json";
import martialistImage from "../res/atlas/martialist.png";
import nettleSageJson from "../res/atlas/nettleSage.json";
import nettleSageImage from "../res/atlas/nettleSage.png";
import sneedCrawlerJson from "../res/atlas/sneedCrawler.json";
import sneedCrawlerImage from "../res/atlas/sneedCrawler.png";
import mapInk from "../res/map.ink";
import mapJson from "../res/map.json";
import rushInk from "../res/rush.ink";
import rushJson from "../res/rush.json";

const Resources: Record<string, string> = {
  "map.ink": mapInk,
  "map.json": mapJson,
  "rush.ink": rushInk,
  "rush.json": rushJson,

  "flats.png": flatsImage,
  "flats.json": flatsJson,

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
