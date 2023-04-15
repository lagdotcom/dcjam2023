import HasHotspots from "./HasHotspots";

export interface GameScreen {
  doNotClear?: boolean;
  onKey(e: KeyboardEvent): void;
  render(): void;
  spotElements: HasHotspots[];
}
