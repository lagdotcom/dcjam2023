import { Pixels } from "../types/flavours";
import XY from "../types/XY";
import Hotspot from "./Hotspot";

export function contains(spot: Hotspot, pos: XY<Pixels>) {
  return (
    pos.x >= spot.x && pos.y >= spot.y && pos.x < spot.ex && pos.y < spot.ey
  );
}
