import {
  AreaName,
  AtlasLayerID,
  AtlasLayerIndex,
  Cells,
  DateYYYYMMDD,
  Pixels,
  Ratio,
  VersionXYZ,
} from "./flavours";
import XY from "./XY";

export interface AtlasTile {
  type: "front" | "side" | "floor" | "ceiling" | "object";
  flipped: boolean;
  tile: { x: Cells; z: Cells };
  screen: XY<Pixels>;
  coords: { x: Pixels; y: Pixels; w: Pixels; h: Pixels; fullWidth: Pixels };

  image: CanvasImageSource; // this is added by DungeonRenderer
}

export interface AtlasLayer {
  on: boolean;
  index: AtlasLayerIndex;
  name: AreaName;
  type: "Walls" | "Decal" | "Floor" | "Ceiling" | "Object";
  id: AtlasLayerID;
  scale: XY<Ratio>;
  offset: XY<Pixels>;
  tiles: AtlasTile[];
}

interface Atlas {
  version: VersionXYZ;
  generated: DateYYYYMMDD;
  resolution: { width: Pixels; height: Pixels };
  depth: Cells;
  width: Cells;
  layers: AtlasLayer[];
}
export default Atlas;
