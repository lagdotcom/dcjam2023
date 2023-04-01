import Dir from "./Dir";
import XY from "./XY";

export type WallDecalType = "Door";

export interface WorldSide {
  solid?: boolean;
  wall?: number;
  decal?: number;
  decalType?: WallDecalType;
}

export interface WorldCell {
  object?: number;
  ceiling?: number;
  floor?: number;
  sides: Partial<Record<Dir, WorldSide>>;
  tags: string[];
}

export interface AtlasReference {
  image: string;
  json: string;
}

interface World {
  name: string;
  atlas: AtlasReference;
  cells: WorldCell[][];
  start: XY;
  facing: Dir;
}
export default World;
