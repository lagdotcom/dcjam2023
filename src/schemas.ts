import Ajv, { JSONSchemaType } from "ajv";

import { MapData, SerializedEngine, WallTypeCondensed } from "./Engine";
import { SerializedPlayer } from "./Player";
import { WallTag } from "./tools/wallTags";
import { XYTag } from "./tools/xyTags";
import { ClassNames } from "./types/ClassName";
import Dir from "./types/Dir";
import { WallDecalTypes, WorldCell } from "./types/World";

const ajv = new Ajv();

const xyTagSchema = {
  type: "string",
  pattern: "\\d+_\\d+",
} satisfies JSONSchemaType<XYTag>;

const wallTagSchema = {
  type: "string",
  pattern: "\\d+,\\d+,[0123]",
} satisfies JSONSchemaType<WallTag>;

const condensedWallTypeSchema: JSONSchemaType<WallTypeCondensed> = {
  type: "string",
  pattern: "d?s?w?",
};

const dirSchema: JSONSchemaType<Dir> = { type: "number", enum: [0, 1, 2, 3] };

const worldCellSchema: JSONSchemaType<WorldCell> = {
  type: "object",
  additionalProperties: false,
  required: ["numbers", "sides", "strings", "tags"],
  properties: {
    ceiling: { type: "number", nullable: true },
    floor: { type: "number", nullable: true },
    numbers: { type: "object", additionalProperties: { type: "number" } },
    object: { type: "number", nullable: true },
    sides: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          decal: { type: "number" },
          decalType: { type: "string", enum: WallDecalTypes },
        },
      },
    },
    strings: { type: "object", additionalProperties: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
  },
};

const mapDataSchema: JSONSchemaType<MapData> = {
  type: "object",
  additionalProperties: false,
  required: ["cells", "overlays", "script", "walls"],
  properties: {
    cells: { type: "array", items: xyTagSchema },
    overlays: {
      type: "object",
      patternProperties: { [xyTagSchema.pattern]: worldCellSchema },
      additionalProperties: false,
    },
    script: { type: "object" },
    walls: {
      type: "object",
      patternProperties: { [wallTagSchema.pattern]: condensedWallTypeSchema },
      additionalProperties: false,
    },
  },
};

const playerSchema: JSONSchemaType<SerializedPlayer> = {
  type: "object",
  additionalProperties: false,
  required: ["name", "className", "hp", "sp"],
  properties: {
    name: { type: "string" },
    className: { type: "string", enum: ClassNames },
    hp: { type: "number" },
    sp: { type: "number" },
    LeftHand: { type: "string", nullable: true },
    RightHand: { type: "string", nullable: true },
    Body: { type: "string", nullable: true },
    Special: { type: "string", nullable: true },
  },
};

const engineSchema: JSONSchemaType<SerializedEngine> = {
  type: "object",
  additionalProperties: false,
  required: [
    "facing",
    "inventory",
    "maps",
    "party",
    "pendingArenaEnemies",
    "pendingNormalEnemies",
    "position",
    "worldLocation",
  ],
  properties: {
    facing: dirSchema,
    inventory: { type: "array", items: { type: "string" } },
    maps: { type: "object", required: [], additionalProperties: mapDataSchema },
    obstacle: { type: "string", nullable: true },
    party: { type: "array", items: playerSchema },
    pendingArenaEnemies: { type: "array", items: { type: "string" } },
    pendingNormalEnemies: { type: "array", items: { type: "string" } },
    position: { type: "string" },
    worldLocation: {
      type: "object",
      required: ["floor", "region", "resourceID"],
      properties: {
        floor: { type: "number" },
        region: { type: "number" },
        resourceID: { type: "string" },
      },
    },
  },
};
export const validateEngine = ajv.compile(engineSchema);
