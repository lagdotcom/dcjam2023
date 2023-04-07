import { WorldSide } from "../types/World";

export function openGate(side: WorldSide) {
  if (side.decalType === "Gate" && typeof side.decal === "number") {
    side.decalType = "OpenGate";
    side.decal++;
    side.solid = false;
  }
}
