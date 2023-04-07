import Dir from "./Dir";
import XY from "./XY";

export type WallDecalType = "Door" | "Gate" | "Sign";

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
  strings: Record<string, string>;
  numbers: Record<string, number>;
}

export interface AtlasReference {
  image: string;
  json: string;
}

interface World {
  name: string;
  atlases: AtlasReference[];
  cells: WorldCell[][];
  start: XY;
  facing: Dir;
}
export default World;
