import { EGAProgressionStatus, GameAnalytics } from "gameanalytics";

import { xyToTag } from "./tools/xyTags";
import { ClassName } from "./types/ClassName";
import { AreaName, Cells, CombatantName, StorageKey } from "./types/flavours";
import XY from "./types/XY";

const GA = GameAnalytics;

const gameKey = process.env.APP_ANALYTICS_GAME_KEY ?? "";
const secretKey = process.env.APP_ANALYTICS_SECRET_KEY ?? "";
const debugAnalytics = process.env.APP_ANALYTICS_DEBUG === "TRUE";
const buildVersion = process.env.APP_BUILD_VERSION ?? "unknown";

const disableKey: StorageKey = "disableAnalytics";
const disableValue = "TRUE";

export function isAnalyticsDisabled() {
  return localStorage.getItem(disableKey) === disableValue;
}

// TODO use this somewhere
export function setAnalyticsDisabled(disabled: boolean) {
  if (disabled) localStorage.setItem(disableKey, disableValue);
  else localStorage.removeItem(disableKey);

  GA.setEnabledEventSubmission(!disabled);
}

export function startAnalytics() {
  GA.setEnabledInfoLog(debugAnalytics);
  GA.setEnabledVerboseLog(debugAnalytics);

  GA.configureBuild(buildVersion);
  GA.initialize(gameKey, secretKey);
  GA.setEnabledEventSubmission(!isAnalyticsDisabled());
}

function sanitise(s: string) {
  return s.replace(/ /g, "_");
}

export function startGame(classes: Set<ClassName>) {
  for (const cn of classes)
    GA.addDesignEvent(`Game:StartingParty:${sanitise(cn)}`);
}

let currentArea: AreaName = "";
export function startArea(name: AreaName) {
  currentArea = sanitise(name);
  GA.addProgressionEvent(EGAProgressionStatus.Start, name);
}

export function completeArea() {
  GA.addProgressionEvent(EGAProgressionStatus.Complete, currentArea, "Floor");
}

export function partyDied() {
  GA.addProgressionEvent(EGAProgressionStatus.Fail, currentArea, "Floor");
}

export function startFight(pos: XY<Cells>, enemies: CombatantName[]) {
  GA.addProgressionEvent(
    EGAProgressionStatus.Start,
    currentArea,
    "Fight",
    xyToTag(pos),
  );
  for (const enemy of enemies)
    GA.addDesignEvent(`Fight:Begin:${sanitise(enemy)}`);
}

export function winFight(pos: XY<Cells>) {
  GA.addProgressionEvent(
    EGAProgressionStatus.Complete,
    currentArea,
    "Fight",
    xyToTag(pos),
  );
}

export function loadIntoArea(name: AreaName) {
  currentArea = sanitise(name);
  GA.addDesignEvent(`Game:Load:${currentArea}`);
}

export function saveGame() {
  GA.addDesignEvent(`Game:Save:${currentArea}`);
}
