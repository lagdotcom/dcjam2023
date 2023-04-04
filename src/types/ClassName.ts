export const ClassNames = [
  "Martialist",
  "Cleavesman",
  "Far Scout",
  "War Caller",
  "Flag Singer",
  "Loam Seer",
] as const;
export type ClassName = (typeof ClassNames)[number];
