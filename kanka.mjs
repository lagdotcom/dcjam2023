/*eslint-env node*/

import { execSync } from "child_process";
import { config as loadDotEnvConfig } from "dotenv";
import { readFileSync, writeFileSync } from "fs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getKanka = (token, version = `1.0`) => {
  const baseUrl = `https://api.kanka.io/${version}/`;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-type", "application/json");

  /** @param {string} url */
  return (url) => {
    console.log("Fetching:", baseUrl + url);
    return fetch(baseUrl + url, { headers });
  };
};

const getKankaCampaign = (token, version = `1.0`, campaignId = 222560) => {
  const baseUrl = `https://api.kanka.io/${version}/campaigns/${campaignId}/`;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-type", "application/json");

  /** @param {string} url */
  return (url) => {
    console.log("Fetching:", baseUrl + url);
    return fetch(baseUrl + url, { headers });
  };
};

/**
 * Get all pages of a Kanka list
 * @param {(url: string) => Promise<Response>} fetcher
 * @param {string} path
 * @returns {Promise<T[]>}
 */
async function getAllPages(fetcher, path) {
  let page = 0;
  let going = true;
  let data = [];

  while (going) {
    page++;
    const url = page === 1 ? path : `${path}&page=${page}`;
    /** @type {import('./src/types/Kanka').KankaListRequest<unknown>} */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const results = await (await fetcher(url)).json();
    data.push(...results.data);

    if (results.meta.current_page === results.meta.last_page) going = false;
  }

  return data;
}

/**
 * @param {import("./src/types/Kanka").KankaEntityWithRelated} e
 * @param {string} name
 * @returns {string|null}
 */
const attr = (e, name) =>
  e.attributes.find((a) => a.name.split("[")[0] === name).value;

function getActionMaker() {
  /**
   * @param {import("./src/types/Kanka").KankaEntityWithRelated} e
   * @returns {Omit<import("./src/types/CombatAction").default, 'act'> & { act: string }}
   */
  return function (e) {
    const sp = attr(e, "SP Cost");

    const action = {
      name: e.name,
      tags: [],
      sp: Number(sp),
    };
    if (attr(e, "Costs all SP?") === "1") action.x = true;

    const targetType = attr(e, "Target Type");
    const targets = { type: targetType };
    action.targets = targets;

    if (targetType !== "self") {
      const count = attr(e, "Target Count");
      if (count) targets.count = Number(count);

      const distance = attr(e, "Target Distance");
      if (distance) targets.distance = Number(distance);

      const offsets = attr(e, "Target Offsets");
      if (offsets) targets.offsets = offsets.split(",").map(Number);
    }

    action.act = fixName(e.name);

    return action;
  };
}

const classnames = [
  "Martialist",
  "Cleavesman",
  "Far Scout",
  "War Caller",
  "Flag Singer",
  "Loam Seer",
];

const stats = [
  "dr",
  "maxHP",
  "maxSP",
  "camaraderie",
  "determination",
  "spirit",
];

/** @param {import("./src/types/Kanka").KankaEntityWithRelated[]} allEntities */
function getItemMaker(allEntities) {
  /**
   * @param {import("./src/types/Kanka").KankaEntityWithRelated} e
   * @returns {Omit<import("./src/types/Item").default, 'action'> & { action: string }}
   */
  return function (e) {
    const item = {
      name: e.name,
      restrict: [],
      slot: attr(e, "Slot"),
      type: attr(e, "Type"),
      bonus: {},
    };
    for (const cn of classnames)
      if (attr(e, cn) === "1") item.restrict.push(cn);

    for (const st of stats) {
      const bonus = attr(e, st);
      if (bonus) item.bonus[st] = Number(bonus);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const abe = e.entity_abilities.at(0);
    if (abe) {
      const ab = allEntities.find(
        (a) => a.type === "ability" && a.child_id === abe.ability_id
      );
      if (ab) item.action = ab.name;
      else console.warn(`Could not find action on ${e.name}`);
    }

    const lore = attr(e, "Lore");
    if (lore) item.lore = lore;

    return item;
  };
}

/**
 * @param {string} name
 * @returns {string}
 */
const fixName = (name) => name.replace(/ /g, "");

/** @param {Omit<import("./src/types/CombatAction").default, 'act'> & { act: string }} action */
function writeAction(action) {
  const { act, ...rest } = action;
  const base = JSON.stringify(rest);

  return `export const ${fixName(action.name)}: CombatAction = ${base.slice(
    0,
    -1
  )}, act: impl.${act} }`;
}

/** @param {Omit<import("./src/types/Item").default, 'action'> & { action: string }} item */
function writeItem(item) {
  const { action, ...rest } = item;
  const base = JSON.stringify(rest);

  return `export const ${fixName(item.name)}: Item = ${base.slice(
    0,
    -1
  )}, action: actions.${action} }`;
}

/**
 * @param {import("./src/types/CombatAction").default[]} actions
 * @returns {string}
 */
function makeActionsFile(actions) {
  return `// This file is automatically generated by kanka.mjs
import * as impl from "./actionImplementations";
import CombatAction from "./types/CombatAction";

${actions.map(writeAction).join("\n\n")}
`;
}

/**
 * @param {import("./src/types/Item").default[]} items
 */
function makeItemsFile(items) {
  return `// This file is automatically generated by kanka.mjs
import * as actions from "./actions";
import Item from "./types/Item";

${items.map(writeItem).join("\n\n")}

export const allItems = Object.fromEntries(
  [${items
    .map((i) => fixName(i.name))
    .join(",")}].map((item) => [item.name, item]),
);

export function getItem(s?: string) {
  return s ? allItems[s] : undefined;
}
`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const out = (obj) => console.dir(obj, { depth: Infinity });

const kankaCacheFile = "./local-only/latest-kanka-data.json";

async function getEntitiesFromKanka() {
  const env = loadDotEnvConfig();

  if (env.error) throw new Error(env.error.message);

  if (!env.parsed) throw new Error("Could not parse .env");

  const token = env.parsed.KANKA_TOKEN;
  if (!token) throw new Error("No KANKA_TOKEN in .env");

  const pd = getKankaCampaign(token);

  /** @type {import("./src/types/Kanka").KankaEntityWithRelated[]} */
  const all = await getAllPages(
    pd,
    "entities?types=item,ability,creature&related=1"
  );
  console.log("Writing:", kankaCacheFile);
  writeFileSync(kankaCacheFile, JSON.stringify(all), {
    encoding: "utf-8",
  });

  return all;
}

/** @returns {import("./src/types/Kanka").KankaEntityWithRelated[]} */
function getEntitiesFromCache() {
  console.log("Reading:", kankaCacheFile);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(
    readFileSync(kankaCacheFile, {
      encoding: "utf-8",
    })
  );
}

function getEntities(cache) {
  if (cache) return getEntitiesFromCache();
  return getEntitiesFromKanka();
}

const kankaActionsFile = "./src/actions.ts";
const kankaItemsFile = "./src/items.ts";

/**
 * @param {{ name: string }} a
 * @param {{ name: string }} b
 */
const sortByName = (a, b) => a.name.localeCompare(b.name);

async function main() {
  const all = await getEntities(true);

  const makeAction = getActionMaker();
  const makeItem = getItemMaker(all);

  const actions = all
    .filter((e) => e.type === "ability")
    .map(makeAction)
    .sort(sortByName);
  const items = all
    .filter((e) => e.type === "item")
    .map(makeItem)
    .sort(sortByName);

  console.log("Writing:", kankaActionsFile);
  writeFileSync(kankaActionsFile, makeActionsFile(actions), {
    encoding: "utf-8",
  });

  console.log("Writing:", kankaItemsFile);
  writeFileSync(kankaItemsFile, makeItemsFile(items), {
    encoding: "utf-8",
  });

  console.log("Fixing formatting...");
  try {
    execSync(`yarn eslint --fix ${kankaActionsFile} ${kankaItemsFile}`);
  } catch {
    /* empty */
  }
}

void main();
