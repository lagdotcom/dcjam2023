// https://spin.atomicobject.com/typescript-flexible-nominal-typing/
interface Flavouring<FlavourT> {
  _type?: FlavourT;
}
type Flavour<T, FlavourT> = T & Flavouring<FlavourT>;

export type AtlasLayerID = Flavour<number, "AtlasLayerID">;
export type AtlasLayerIndex = Flavour<number, "AtlasLayerIndex">;
export type Cells = Flavour<number, "Cells">;
export type HitPoints = Flavour<number, "HitPoints">;
export type MapFloor = Flavour<number, "MapFloor">;
export type MapRegion = Flavour<number, "MapRegion">;
export type Milliseconds = Flavour<number, "Milliseconds">;
export type Pixels = Flavour<number, "Pixels">;
export type Quadrants = Flavour<number, "Quadrants">;
export type Ratio = Flavour<number, "Ratio">;
export type Seconds = Flavour<number, "Seconds">;
export type SkillPoints = Flavour<number, "SkillPoints">;
export type TextureIndex = Flavour<number, "TextureIndex">;
export type Turns = Flavour<number, "Turns">;

export type ActionName = Flavour<string, "ActionName">;
export type AreaName = Flavour<string, "AreaName">;
export type CellDataKey = Flavour<string, "CellDataKey">;
export type CellTag = Flavour<string, "CellTag">;
export type Colour = Flavour<string, "Colour">;
export type CombatantName = Flavour<string, "CombatantName">;
export type CSSCursor = Flavour<string, "CSSCursor">;
export type DateYYYYMMDD = Flavour<string, "DateYYYYMMDD">;
export type Description = Flavour<string, "Description">;
export type EffectName = Flavour<string, "EffectName">;
export type FontFamily = Flavour<string, "FontFamily">;
export type InkSource = Flavour<string, "InkSource">;
export type ItemName = Flavour<string, "ItemName">;
export type KnotName = Flavour<string, "KnotName">;
export type ResourceID = Flavour<string, "ResourceID">;
export type ResourceURL = Flavour<string, "ResourceURL">;
export type SaveName = Flavour<string, "SaveName">;
export type SkillName = Flavour<string, "SkillName">;
export type StorageKey = Flavour<string, "StorageKey">;
export type VersionXYZ = Flavour<string, "VersionXYZ">;
