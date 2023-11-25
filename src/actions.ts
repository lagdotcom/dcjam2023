// This file is automatically generated by [yarn kanka]
import * as impl from "./actionImplementations";
import CombatAction from "./types/CombatAction";

export const Arrow: CombatAction = {
  name: "Arrow",
  tags: [],
  sp: 3,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [1, 2, 3] },
  act: impl.Arrow,
};

export const Attack: CombatAction = {
  name: "Attack",
  tags: [],
  sp: 1,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Attack,
};

export const Barb: CombatAction = {
  name: "Barb",
  tags: [],
  sp: 3,
  targets: { type: "self" },
  act: impl.Barb,
};

export const Bash: CombatAction = {
  name: "Bash",
  tags: [],
  sp: 1,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Bash,
};

export const Bind: CombatAction = {
  name: "Bind",
  tags: [],
  sp: 4,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0, 1, 2, 3] },
  act: impl.Bind,
};

export const Bless: CombatAction = {
  name: "Bless",
  tags: [],
  sp: 2,
  targets: { type: "ally", count: 1 },
  act: impl.Bless,
};

export const Brace: CombatAction = {
  name: "Brace",
  tags: [],
  sp: 3,
  targets: { type: "self" },
  act: impl.Brace,
};

export const Bravery: CombatAction = {
  name: "Bravery",
  tags: [],
  sp: 3,
  targets: { type: "ally" },
  act: impl.Bravery,
};

export const Chakra: CombatAction = {
  name: "Chakra",
  tags: [],
  sp: 3,
  targets: { type: "self" },
  act: impl.Chakra,
};

export const Cheer: CombatAction = {
  name: "Cheer",
  tags: [],
  sp: 2,
  targets: { type: "self/ally", count: 1, distance: 1, offsets: [0, 1, 2, 3] },
  act: impl.Cheer,
};

export const Conduct: CombatAction = {
  name: "Conduct",
  tags: [],
  sp: 3,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Conduct,
};

export const Crackle: CombatAction = {
  name: "Crackle",
  tags: [],
  sp: 2,
  targets: { type: "self/enemy" },
  act: impl.Crackle,
};

export const Deflect: CombatAction = {
  name: "Deflect",
  tags: [],
  sp: 3,
  targets: { type: "self" },
  act: impl.Deflect,
};

export const Defy: CombatAction = {
  name: "Defy",
  tags: [],
  sp: 3,
  targets: { type: "self/enemy" },
  act: impl.Defy,
};

export const DuoStab: CombatAction = {
  name: "Duo Stab",
  tags: [],
  sp: 3,
  targets: { type: "enemy/multiple", count: 2, distance: 1, offsets: [0, 2] },
  act: impl.DuoStab,
};

export const Endure: CombatAction = {
  name: "Endure",
  tags: [],
  sp: 2,
  targets: { type: "self/enemy" },
  act: impl.Endure,
};

export const Flight: CombatAction = {
  name: "Flight",
  tags: [],
  sp: 4,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [1, 3] },
  act: impl.Flight,
};

export const Fortify: CombatAction = {
  name: "Fortify",
  tags: [],
  sp: 3,
  targets: { type: "self/ally" },
  act: impl.Fortify,
};

export const Gleam: CombatAction = {
  name: "Gleam",
  tags: [],
  sp: 3,
  targets: { type: "self" },
  act: impl.Gleam,
};

export const Gouge: CombatAction = {
  name: "Gouge",
  tags: [],
  sp: 5,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Gouge,
};

export const Honour: CombatAction = {
  name: "Honour",
  tags: [],
  sp: 2,
  targets: { type: "self/ally" },
  act: impl.Honour,
};

export const Inspire: CombatAction = {
  name: "Inspire",
  tags: [],
  sp: 4,
  targets: { type: "self/ally/enemy" },
  act: impl.Inspire,
};

export const Kneel: CombatAction = {
  name: "Kneel",
  tags: [],
  sp: 0,
  targets: { type: "self" },
  act: impl.Kneel,
};

export const Lash: CombatAction = {
  name: "Lash",
  tags: [],
  sp: 3,
  targets: { type: "enemy", count: 1, offsets: [0, 1, 2, 3] },
  act: impl.Lash,
};

export const Lure: CombatAction = {
  name: "Lure",
  tags: [],
  sp: 1,
  targets: { type: "self/ally/enemy" },
  act: impl.Lure,
};

export const Mantra: CombatAction = {
  name: "Mantra",
  tags: [],
  sp: 3,
  targets: { type: "ally", count: 1, distance: 1, offsets: [0, 1, 2, 3] },
  act: impl.Mantra,
};

export const Mudra: CombatAction = {
  name: "Mudra",
  tags: [],
  sp: 3,
  targets: { type: "self" },
  act: impl.Mudra,
};

export const Muse: CombatAction = {
  name: "Muse",
  tags: [],
  sp: 2,
  targets: { type: "self/ally/multiple" },
  act: impl.Muse,
};

export const Parry: CombatAction = {
  name: "Parry",
  tags: [],
  sp: 3,
  targets: { type: "self/enemy" },
  act: impl.Parry,
};

export const Pose: CombatAction = {
  name: "Pose",
  tags: [],
  sp: 2,
  targets: { type: "self/ally/enemy" },
  act: impl.Pose,
};

export const Rain: CombatAction = {
  name: "Rain",
  tags: [],
  sp: 5,
  targets: { type: "self/ally/enemy", offsets: [0, 1, 2, 3] },
  act: impl.Rain,
};

export const Ram: CombatAction = {
  name: "Ram",
  tags: [],
  sp: 4,
  targets: { type: "self/ally/enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Ram,
};

export const Reforge: CombatAction = {
  name: "Reforge",
  tags: [],
  sp: 5,
  targets: { type: "self" },
  act: impl.Reforge,
};

export const Rumble: CombatAction = {
  name: "Rumble",
  tags: [],
  sp: 4,
  targets: { type: "enemy", count: 2, offsets: [0, 1, 2, 3] },
  act: impl.Rumble,
};

export const Sand: CombatAction = {
  name: "Sand",
  tags: [],
  sp: 1,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0, 1, 2, 3] },
  act: impl.Sand,
};

export const Scar: CombatAction = {
  name: "Scar",
  tags: [],
  sp: 3,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Scar,
};

export const Search: CombatAction = {
  name: "Search",
  tags: [],
  sp: 4,
  targets: { type: "self/ally" },
  act: impl.Search,
};

export const Smash: CombatAction = {
  name: "Smash",
  tags: [],
  sp: 3,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0] },
  act: impl.Smash,
};

export const Stealth: CombatAction = {
  name: "Stealth",
  tags: [],
  sp: 5,
  targets: { type: "self/ally/enemy" },
  act: impl.Stealth,
};

export const Study: CombatAction = {
  name: "Study",
  tags: [],
  sp: 1,
  targets: { type: "self" },
  act: impl.Study,
};

export const Swarm: CombatAction = {
  name: "Swarm",
  tags: [],
  sp: 2,
  targets: { type: "self/ally/enemy", count: 3, distance: 3, offsets: [0] },
  act: impl.Swarm,
};

export const Sweep: CombatAction = {
  name: "Sweep",
  tags: [],
  sp: 3,
  targets: { type: "enemy/multiple", count: 3, distance: 3, offsets: [0] },
  act: impl.Sweep,
};

export const Tackle: CombatAction = {
  name: "Tackle",
  tags: [],
  sp: 3,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [1, 3] },
  act: impl.Tackle,
};

export const Thrust: CombatAction = {
  name: "Thrust",
  tags: [],
  sp: 2,
  targets: { type: "self/ally/enemy", count: 1, distance: 1, offsets: [0, 2] },
  act: impl.Thrust,
};

export const Trick: CombatAction = {
  name: "Trick",
  tags: [],
  sp: 1,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0, 1, 2, 3] },
  act: impl.Trick,
};

export const Truce: CombatAction = {
  name: "Truce",
  tags: [],
  sp: 6,
  targets: { type: "enemy/multiple", offsets: [0, 1, 2, 3] },
  act: impl.Truce,
};

export const Unveil: CombatAction = {
  name: "Unveil",
  tags: [],
  sp: 1,
  targets: { type: "enemy", count: 1, distance: 1, offsets: [0, 1, 2, 3] },
  act: impl.Unveil,
};

export const Vanish: CombatAction = {
  name: "Vanish",
  tags: [],
  sp: 2,
  targets: { type: "self" },
  act: impl.Vanish,
};

export const VoxPop: CombatAction = {
  name: "Vox Pop",
  tags: [],
  sp: 4,
  targets: { type: "enemy/ally/self/multiple" },
  act: impl.VoxPop,
};

export const Wrestle: CombatAction = {
  name: "Wrestle",
  tags: [],
  sp: 2,
  targets: { type: "self/ally/enemy", count: 1, distance: 1, offsets: [1, 3] },
  act: impl.Wrestle,
};
