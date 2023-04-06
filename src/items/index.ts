import Item from "../types/Item";
import * as cleavesman from "./cleavesman";
import * as farScout from "./farScout";
import * as flagSinger from "./flagSinger";
import * as loamSeer from "./loamSeer";
import * as martialist from "./martialist";
import * as warCaller from "./warCaller";

const allItems = {
  ...cleavesman,
  ...farScout,
  ...flagSinger,
  ...loamSeer,
  ...martialist,
  ...warCaller,
};

export type ItemName = keyof typeof allItems;

export function getItem(s: string): Item | undefined {
  return allItems[s as ItemName];
}
