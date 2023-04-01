export const ClassNames = [
  "Brawler",
  "Knight",
  "Thief",
  "Paladin",
  "Bard",
  "Mage",
] as const;
export type ClassName = (typeof ClassNames)[number];
