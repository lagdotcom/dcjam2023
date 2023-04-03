import Hotspot from "../tools/Hotspot";

export default interface HasHotspots {
  spots: Hotspot[];
  spotClicked(spot: Hotspot): void;
}
