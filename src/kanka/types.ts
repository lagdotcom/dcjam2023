export type EntityType =
  | "character"
  | "family"
  | "location"
  | "organisation"
  | "item"
  | "note"
  | "event"
  | "calendar"
  | "race"
  | "quest"
  | "journal"
  | "tag"
  | "dice_roll"
  | "conversation"
  | "attribute_template"
  | "ability"
  | "map"
  | "timeline"
  | "bookmark"
  | "creature";

export enum EntityTypeID {
  Character = 1,
  Family,
  Location,
  Organisation,
  Item,
  Note,
  Event,
  Calendar,
  Race,
  Quest,
  Journal,
  Tag,
  DiceRoll,
  Conversation,
  AttributeTemplate,
  Ability,
  Map,
  Timeline,
  Bookmark,
  Creature,
}

export type AttributeType = "text" | "checkbox" | "section" | "number";

export enum AttributeTypeID {
  Text = 1,
  Checkbox = 3,
  Section = 4,
  Number = 6,
}

interface Bookkeeping {
  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
}

export interface Ability extends Bookkeeping {
  id: number;
  name: string;
  entry: string;
  entry_parsed: string;
  tooltip: string | null;
  image: string | null;
  focus_x: string | null;
  focus_y: string | null;
  image_full: string;
  image_thumb: string;
  has_custom_image: boolean;
  image_uuid: string | null;
  has_custom_header: boolean;
  is_private: boolean;
  is_template: boolean;
  is_attributes_private: boolean;
  entity_id: number;
  tags: number[];
  urls: { view: string; api: string };
  type: string;
  ability_id: number | null;
  charges: number | null;
  abilities: [];
}
export type AbilityWithRelated = Ability & RelatedInfo;

export interface Character extends Bookkeeping {
  id: number;
  name: string;
  entry: string;
  entry_parsed: string;
  tooltip: string | null;
  image: string | null;
  focus_x: string | null;
  focus_y: string | null;
  image_full: string;
  image_thumb: string;
  has_custom_image: boolean;
  image_uuid: string | null;
  header_full: string;
  header_uuid: string | null;
  has_custom_header: boolean;
  is_private: boolean;
  is_template: boolean;
  is_attributes_private: boolean;
  entity_id: number;
  tags: number[];
  urls: { view: string; api: string };
  location_id: number | null;
  title: string;
  age: number | null;
  sex: string | null;
  pronouns: string | null;
  race_id: number | null;
  races: number[];
  type: string;
  family_id: number | null;
  families: number[];
  is_dead: boolean;
  traits: [];
  is_personality_visible: boolean;
  is_personality_pinned: boolean;
  is_appearance_pinned: boolean;
  organisations: {
    data: [];
    sync: string;
  };
}
export type CharacterWithRelated = Character & RelatedInfo;

export interface Creature extends Bookkeeping {
  id: number;
  name: string;
  entry: string;
  entry_parsed: string;
  tooltip: string | null;
  image: string | null;
  focus_x: string | null;
  focus_y: string | null;
  image_full: string;
  image_thumb: string;
  has_custom_image: boolean;
  image_uuid: string | null;
  header_full: string;
  header_uuid: string | null;
  has_custom_header: boolean;
  is_private: boolean;
  is_template: boolean;
  is_attributes_private: boolean;
  entity_id: number;
  tags: number[];
  urls: { view: string; api: string };
  type: string;
  creature_id: number | null;
  locations: number[];
}
export type CreatureWithRelated = Creature & RelatedInfo;

export interface Item extends Bookkeeping {
  id: number;
  name: string;
  entry: string;
  entry_parsed: string;
  tooltip: string | null;
  image: string | null;
  focus_x: string | null;
  focus_y: string | null;
  image_full: string;
  image_thumb: string;
  has_custom_image: boolean;
  image_uuid: string | null;
  header_full: string;
  header_uuid: string | null;
  has_custom_header: boolean;
  is_private: boolean;
  is_template: boolean;
  is_attributes_private: boolean;
  entity_id: number;
  tags: number[];
  urls: { view: string; api: string };
  location_id: number | null;
  character_id: number | null;
  locations: number[];
  type: string;
  price: number | null;
  size: string | null;
  item_id: number | null;
}
export type ItemWithRelated = Item & RelatedInfo;

export interface Entity extends Bookkeeping {
  id: number;
  name: string;
  /** @deprecated */
  type: EntityType;
  type_id: EntityTypeID;
  child_id: number;
  image?: string;
  image_full?: string;
  image_thumb?: string;
  image_uuid: string | null;
  is_private: boolean;
  is_template: boolean;
  campaign_id: number;
  is_attributes_private: boolean;
  tooltip: string | null;
  header_image: string | null;
  tags: number[];
  urls: { view: string; api: string };
}

export interface Attribute extends Bookkeeping {
  api_key: string;
  default_order: number;
  entity_id: number;
  id: number;
  is_pinned: boolean;
  is_private: boolean;
  is_star: boolean;
  name: string;
  parsed: string;
  type: AttributeType;
  type_id: AttributeTypeID;
  value: string | null;
}

export interface EntityAbility extends Bookkeeping {
  id: number;
  visibility_id: number;
  charges: number | null;
  ability_id: number;
  position: number;
  note: string;
}

export interface Relation extends Bookkeeping {
  id: number;
  owner_id: number;
  target_id: number;
  relation: string;
  attitude: number | null;
  colour: string;
  visibility_id: number;
  is_star: boolean;
  is_pinned: boolean;
  mirror_id: number | null;
}

export type RelatedInfo = {
  attributes: Attribute[];
  posts: [];
  entity_events: [];
  relations: Relation[];
  inventory: [];
  entity_abilities: EntityAbility[];
  entity_assets: [];
};

export type EntityWithRelated = Entity & RelatedInfo;

export interface ListRequest<T> {
  data: T[];
  sync: string;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
