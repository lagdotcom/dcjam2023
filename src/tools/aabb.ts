import XY from "../types/XY";
import Hotspot from "./Hotspot";

export function contains(spot: Hotspot, pos: XY) {
  return (
    pos.x >= spot.x && pos.y >= spot.y && pos.x < spot.ex && pos.y < spot.ey
  );
}
