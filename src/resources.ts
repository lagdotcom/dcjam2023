import enemiesImage from "../res/atlas/enemies.png";
import enemiesJson from "../res/atlas/enemies.json";
import mapDScript from "../res/map.dscript";
import test1Image from "../res/atlas/test1.png";
import test1Json from "../res/atlas/test1.json";

const Resources: Record<string, string> = {
  "enemies.png": enemiesImage,
  "enemies.json": enemiesJson,
  "test1.png": test1Image,
  "test1.json": test1Json,
  "map.dscript": mapDScript,
};

export function getResourceURL(id: string) {
  const value = Resources[id];
  if (!value) throw new Error(`Invalid resource ID: ${id}`);
  return value;
}
