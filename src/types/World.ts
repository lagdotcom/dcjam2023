import Dir from "./Dir";
import {
  AreaName,
  AtlasLayerID,
  CellDataKey,
  Cells,
  CellTag,
  ResourceURL,
} from "./flavours";
import XY from "./XY";

export const WallDecalTypes = [
  "Door",
  "Gate",
  "OpenGate",
  "Lever",
  "PulledLever",
  "Sign",
] as const;
export type WallDecalType = (typeof WallDecalTypes)[number];

export interface WorldSide {
  solid?: boolean;
  wall?: AtlasLayerID;
  decal?: AtlasLayerID;
  decalType?: WallDecalType;
}

export interface WorldCell {
  object?: AtlasLayerID;
  ceiling?: AtlasLayerID;
  floor?: AtlasLayerID;
  sides: Partial<Record<Dir, WorldSide>>;
  tags: CellTag[];
  strings: Record<CellDataKey, string>;
  numbers: Record<CellDataKey, number>;
}

export interface AtlasReference {
  image: ResourceURL;
  json: ResourceURL;
}

interface World {
  name: AreaName;
  atlases: AtlasReference[];
  cells: WorldCell[][];
  start: XY<Cells>;
  facing: Dir;
}
export default World;
