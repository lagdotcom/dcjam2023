import { KeyCode } from "../types/flavours";

export default function getKeyNames(
  key: KeyCode,
  shift: boolean,
  alt: boolean,
  ctrl: boolean,
) {
  const names = [key];

  if (shift) names.unshift("Shift+" + key);
  if (alt) names.unshift("Alt+" + key);
  if (ctrl) names.unshift("Ctrl+" + key);

  return names;
}
