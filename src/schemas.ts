import Ajv, { JSONSchemaType } from "ajv";

import { SerializedEngine } from "./Engine";
import { SerializedKnownMap } from "./KnownMapData";
import { WallTypeCondensed } from "./KnownMapData";
import { SerializedPlayer } from "./Player";
import { WallTag } from "./tools/wallTags";
import { XYTag } from "./tools/xyTags";
import { ClassNames } from "./types/ClassName";
import Dir from "./types/Dir";

const ajv = new Ajv();

const xyTagSchema: JSONSchemaType<XYTag> = {
  type: "string",
  pattern: "\\d+_\\d+",
};

const wallTagSchema = {
  type: "string",
  pattern: "\\d+,\\d+,[0123]",
} satisfies JSONSchemaType<WallTag>;

const condensedWallTypeSchema: JSONSchemaType<WallTypeCondensed> = {
  type: "string",
  pattern: "d?s?w?",
};

const dirSchema: JSONSchemaType<Dir> = { type: "number", enum: [0, 1, 2, 3] };

const knownMapSchema: JSONSchemaType<SerializedKnownMap> = {
  type: "object",
  additionalProperties: false,
  required: ["cells", "walls"],
  properties: {
    cells: {
      type: "object",
      required: [],
      additionalProperties: { type: "array", items: xyTagSchema },
    },
    walls: {
      type: "object",
      required: [],
      additionalProperties: {
        type: "object",
        patternProperties: { [wallTagSchema.pattern]: condensedWallTypeSchema },
        additionalProperties: false,
      },
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
    "knownMap",
    "party",
    "pendingArenaEnemies",
    "pendingNormalEnemies",
    "position",
    "script",
    "worldLocation",
  ],
  properties: {
    facing: dirSchema,
    inventory: { type: "array", items: { type: "string" } },
    knownMap: knownMapSchema,
    obstacle: { type: "string", nullable: true },
    party: { type: "array", items: playerSchema },
    pendingArenaEnemies: { type: "array", items: { type: "string" } },
    pendingNormalEnemies: { type: "array", items: { type: "string" } },
    position: { type: "string" },
    script: { type: "object" },
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
