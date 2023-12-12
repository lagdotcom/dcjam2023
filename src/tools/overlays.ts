import Engine from "../Engine";
import Dir from "../types/Dir";
import removeItem from "./arrays";
import { tagToXy, XYTag } from "./xyTags";

export type Overlay =
  | { type: "addTag"; xy: XYTag; value: string }
  | { type: "removeTag"; xy: XYTag; value: string }
  | { type: "removeObject"; xy: XYTag }
  | { type: "setDecal"; xy: XYTag; dir: Dir; value: number }
  | { type: "setSolid"; xy: XYTag; dir: Dir; value: boolean };

function updatePartialRecord<K extends string | number, T>(
  record: Partial<Record<K, T>>,
  key: K,
  patch: T,
) {
  const entry = record[key];
  if (entry) Object.assign(entry, patch);
  else record[key] = patch;
}

export function applyOverlay(g: Engine, overlay: Overlay) {
  const { x, y } = tagToXy(overlay.xy);
  const cell = g.getCell(x, y);
  if (!cell) throw new Error(`Could not apply overlay at ${overlay.xy}`);

  switch (overlay.type) {
    case "addTag":
      cell.tags.push(overlay.value);
      return;

    case "removeTag":
      if (!removeItem(cell.tags, overlay.value))
        console.warn(
          `script tried to remove tag ${overlay.value} at ${overlay.xy} -- not present`,
        );
      return;

    case "removeObject":
      cell.object = undefined;
      return;

    case "setDecal":
      return updatePartialRecord(cell.sides, overlay.dir, {
        decal: overlay.value,
      });

    case "setSolid":
      return updatePartialRecord(cell.sides, overlay.dir, {
        solid: overlay.value,
      });

    default:
      throw new Error(`Invalid overlay: ${JSON.stringify(overlay)}`);
  }
}

export function updateMap(g: Engine, overlay: Overlay) {
  g.map.update(overlay);
  applyOverlay(g, overlay);
}
