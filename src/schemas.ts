import Ajv, { JSONSchemaType } from "ajv";

import { MapData, SerializedEngine, WallTypeCondensed } from "./Engine";
import { SerializedPlayer } from "./Player";
import { Overlay } from "./tools/overlays";
import { WallTag } from "./tools/wallTags";
import { XYTag } from "./tools/xyTags";
import { ClassNames } from "./types/ClassName";
import Dir from "./types/Dir";

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

export const overlaySchema: JSONSchemaType<Overlay> = {
  type: "object",
  required: ["type"],
  anyOf: [
    {
      type: "object",
      required: ["type", "xy", "value"],
      properties: {
        type: { const: "addTag" },
        xy: xyTagSchema,
        value: { type: "string" },
      },
    },
    {
      type: "object",
      required: ["type", "xy", "value"],
      properties: {
        type: { const: "removeTag" },
        xy: xyTagSchema,
        value: { type: "string" },
      },
    },
    {
      type: "object",
      required: ["type", "xy"],
      properties: {
        type: { const: "removeObject" },
        xy: xyTagSchema,
      },
    },
    {
      type: "object",
      required: ["type", "xy", "dir", "value"],
      properties: {
        type: { const: "setDecal" },
        xy: xyTagSchema,
        dir: dirSchema,
        value: { type: "number" },
      },
    },
    {
      type: "object",
      required: ["type", "xy", "dir", "value"],
      properties: {
        type: { const: "setSolid" },
        xy: xyTagSchema,
        dir: dirSchema,
        value: { type: "boolean" },
      },
    },
  ],
};

const mapDataSchema: JSONSchemaType<MapData> = {
  type: "object",
  additionalProperties: false,
  required: ["cells", "overlays", "script", "walls"],
  properties: {
    cells: { type: "array", items: xyTagSchema },
    overlays: { type: "array", items: overlaySchema },
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
    "name",
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
    name: { type: "string" },
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
