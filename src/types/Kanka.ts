export type KankaType =
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

export enum KankaTypeID {
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

export type KankaAttributeType = "text" | "checkbox" | "section" | "number";

export enum KankaAttributeTypeID {
  Text = 1,
  Checkbox = 3,
  Section = 4,
  Number = 6,
}

export interface KankaAttribute {
  api_key: string;
  created_at: string;
  created_by: number | null;
  default_order: number;
  entity_id: number;
  id: number;
  is_pinned: boolean;
  is_private: boolean;
  is_star: boolean;
  name: string;
  parsed: string;
  type: KankaAttributeType;
  type_id: KankaAttributeTypeID;
  updated_at: string;
  updated_by: number | null;
  value: string | null;
}

export interface KankaEntity {
  id: number;
  name: string;
  /** @deprecated */
  type: KankaType;
  type_id: KankaTypeID;
  child_id: number;
  image?: string;
  image_full?: string;
  image_thumb?: string;
  image_uuid: string | null;
  is_private: boolean;
  is_template: boolean;
  campaign_id: number;
  is_attributes_private: boolean;
  tooltip: null;
  header_image: null;
  tags: number[];
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  urls: { view: string; api: string };
}

export type KankaEntityWithAttributes = KankaEntity & {
  attributes: KankaAttribute[];
};

export interface KankaListRequest<T> {
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
