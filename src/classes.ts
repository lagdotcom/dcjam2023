import { GorgothilSword, Haringplate } from "./items/cleavesman";
import { CarvingKnife, SignedCasque } from "./items/flagSinger";
import { Cornucopia, JacketAndRucksack } from "./items/loamSeer";
import { Penduchaimmer, HaringleeKasaya } from "./items/martialist";
import { OwlSkull, IronFullcase } from "./items/warCaller";
import { ClassName } from "./types/ClassName";
import Combatant, { AttackableStat } from "./types/Combatant";
import Item from "./types/Item";

type ClassData = Pick<Combatant, AttackableStat> & {
  name: string;
  lore?: string;
  items: Item[];
  skill: string;
};

const classes: Record<ClassName, ClassData> = {
  Martialist: {
    name: "Kirkwin",
    hp: 21,
    sp: 7,
    determination: 6,
    camaraderie: 2,
    spirit: 3,
    items: [Penduchaimmer, HaringleeKasaya],
    skill: "Smash",
  },
  Cleavesman: {
    name: "Mogrigg",
    lore: `The village's headsman, a role instigated by Cherraphy and chosen at random. Considered a luckless man, not blamed for the three lives he's taken at his god's behest. Was previously a loyal soldier and pikeman at a time when his lord was just and interested in protecting the border villages, before the man's personality crumbled into rote righteousness. Mogrigg still has the scars, but none of the respect he earned. Of course he volunteered to brave the Nightjar! His hand was the first to rise!`,
    hp: 25,
    sp: 6,
    determination: 4,
    camaraderie: 4,
    spirit: 3,
    items: [GorgothilSword, Haringplate],
    skill: "Cut",
  },
  "Far Scout": {
    name: "Tam",
    lore: `The surest bow in Haringlee. Favouring high cliffs above the treetops, she is a very fine huntress who's found that her place in the village of her birth has become slowly less secure. Tam worships only as far as socially necessary, excusing herself more and more from the mania overtaking the populace. Still, that does leave more time to practise her woodscraft, her acrobacy and her deadly aim. Sensing the opportunity for change in the expedition to the Nightjar, she signs up, explaining that she already knows the best route over the river.`,
    hp: 18,
    sp: 7,
    determination: 3,
    camaraderie: 3,
    spirit: 5,
    items: [],
    skill: "Tamper",
  },
  "War Caller": {
    name: "Silas",
    hp: 30,
    sp: 5,
    determination: 5,
    camaraderie: 2,
    spirit: 4,
    items: [OwlSkull, IronFullcase],
    skill: "Prayer",
  },
  "Flag Singer": {
    name: "Belsome",
    lore: `A travelling auteur, stranded in Haringlee, their stagecoach impounded under the most arbitrary of Cherraphic laws. Before that, a bard, and before that, a wanted street thief. Now reformed as an entertainer, their reflexes remain true. Belsome has the instinct and the presence of mind needed to size up a dangerous situation, the savvy required to navigate it without incident and the compassion that also steers those around them to safety. Belsome doesn't know how vital their skills of performance, of misdirection and of psychic intuition will be inside the Fortress Nightjar, but this isn't exactly the first time they've performed without rehearsal.`,
    hp: 21,
    sp: 6,
    determination: 2,
    camaraderie: 6,
    spirit: 3,
    items: [CarvingKnife, SignedCasque],
    skill: "Kneel",
  },
  "Loam Seer": {
    name: "Chiteri",
    lore: `Chiteri is a beetle-like humanoid who observes human activity from safety, where the river meets the wood. Sad at the many recent upheavals in Haringlee culture, Chiteri reveals her existence to the dumbfounded villagers and, furthermore, offers her magical assistance in their trip to the Nightjar, secretly planning to defame the goddess Cherraphy, thereby salvaging the lives of the people. Able to call on the magic dwelling deep within the earth, Chiteri is a canny healer and is also able to bestow curious magickal toughness to her quick new friends, even if she doesn't share their cause.`,
    hp: 18,
    sp: 5,
    determination: 2,
    camaraderie: 5,
    spirit: 4,
    items: [Cornucopia, JacketAndRucksack],
    skill: "Shift",
  },
};
export default classes;
