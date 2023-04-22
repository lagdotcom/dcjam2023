import { SerializedEngine } from "./Engine";

const SaveSlots = ["save1", "save2", "save3"] as const;
type SaveSlot = (typeof SaveSlots)[number];

export function getSavedGame(slot: SaveSlot) {
  const data = localStorage.getItem(slot);
  if (data !== null) return JSON.parse(data) as SerializedEngine;
}

export function getSavedGames() {
  return SaveSlots.map(getSavedGame);
}

export function anySavedGamesExist() {
  for (const slot of SaveSlots) {
    const game = getSavedGame(slot);
    if (game) return true;
  }

  return false;
}
