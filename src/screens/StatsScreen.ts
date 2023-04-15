import Colours, { getItemColour } from "../Colours";
import Engine from "../Engine";
import Player, { PlayerEquipmentSlot } from "../Player";
import { xy } from "../tools/geometry";
import Hotspot from "../tools/Hotspot";
import { wrap } from "../tools/numbers";
import withTextStyle from "../tools/withTextStyle";
import { BoostableStat } from "../types/Combatant";
import Dir from "../types/Dir";
import { GameScreen } from "../types/GameScreen";
import HasHotspots from "../types/HasHotspots";
import Item from "../types/Item";

const displayStatName: Record<BoostableStat, string> = {
  dr: "DR",
  maxHP: "HP",
  maxSP: "SP",
  camaraderie: "CAM",
  determination: "DTM",
  spirit: "SPR",
};

const displaySlotName: Record<PlayerEquipmentSlot, string> = {
  LeftHand: "Left Hand",
  RightHand: "Right Hand",
  Body: "Body",
  Special: "Special",
};

const displaySlots: PlayerEquipmentSlot[] = [
  "LeftHand",
  "RightHand",
  "Body",
  "Special",
];

type SpotTag =
  | { type: "equipment"; slot: PlayerEquipmentSlot }
  | { type: "inventory"; item: Item };
type Spot = Hotspot & SpotTag;

const StatOffset = 30;
const EquipmentOffset = 80;
const InventoryOffset = 160;
const ItemsPerPage = 8;

export default class StatsScreen implements GameScreen, HasHotspots {
  background: GameScreen;
  cursorColumn: "equipment" | "inventory";
  dir: Dir;
  index: number;
  spotElements: HasHotspots[];
  spots: Spot[];

  constructor(
    public g: Engine,
    public position = xy(91, 21),
    public size = xy(296, 118),
    public padding = xy(2, 2)
  ) {
    g.draw();
    this.background = g.screen;
    this.cursorColumn = "inventory";
    this.dir = g.facing;
    this.index = 0;
    this.spotElements = [this];
    this.spots = [];
  }

  onKey(e: KeyboardEvent): void {
    switch (e.code) {
      case "Escape":
        e.preventDefault();
        this.g.screen = this.background;
        this.g.draw();
        return;

      case "ArrowLeft":
        e.preventDefault();
        this.turn(-1);
        return;

      case "ArrowRight":
        e.preventDefault();
        this.turn(1);
        return;

      case "ArrowUp":
        e.preventDefault();
        this.move(-1);
        return;

      case "ArrowDown":
        e.preventDefault();
        this.move(1);
        return;

      case "Enter":
      case "Return":
        e.preventDefault();
        this.toggle();
        return;

      case "Tab":
      case "ShiftLeft":
      case "ShiftRight":
        e.preventDefault();
        this.cursorColumn =
          this.cursorColumn === "equipment" ? "inventory" : "equipment";
        this.g.draw();
        return;

      default:
        // TODO
        console.log("key:", e.code);
    }
  }

  turn(mod: number) {
    this.g.turn(mod);
    this.dir = this.g.facing;
  }

  move(mod: number) {
    const max =
      this.cursorColumn === "equipment"
        ? displaySlots.length
        : this.g.inventory.length;

    this.index = wrap(this.index + mod, max);
    this.g.draw();
  }

  toggle() {
    const pc = this.g.party[this.dir];

    if (this.cursorColumn === "equipment") {
      const slot = displaySlots[this.index];
      pc.remove(slot);
    } else {
      const item = this.g.inventory[this.index];
      if (!item) return;
      pc.equip(item);
    }

    this.g.draw();
  }

  spotClicked(spot: Spot) {
    const pc = this.g.party[this.dir];

    if (spot.type === "equipment") {
      pc.remove(spot.slot);
      this.g.draw();
    } else {
      pc.equip(spot.item);
      this.g.draw();
    }
  }

  render(): void {
    this.background.render();

    const { dir, padding, position, size } = this;
    const { ctx, inventory, party } = this.g;

    ctx.fillStyle = Colours.logShadow;
    ctx.fillRect(position.x, position.y, size.x, size.y);

    const pc = party[dir];
    const sx = position.x + padding.x;
    const sy = position.y + padding.y;

    const { draw, lineHeight: lh } = withTextStyle(ctx, {
      textAlign: "left",
      textBaseline: "top",
      fillStyle: "white",
    });
    draw(pc.name, sx, sy);
    draw(pc.className, sx, sy + lh);

    this.renderStatWithMax(pc, "hp", sx, sy + lh * 2);
    this.renderStatWithMax(pc, "sp", sx, sy + lh * 3);
    this.renderStat(pc, "dr", sx, sy + lh * 4);
    this.renderStat(pc, "camaraderie", sx, sy + lh * 5);
    this.renderStat(pc, "determination", sx, sy + lh * 6);
    this.renderStat(pc, "spirit", sx, sy + lh * 7);

    this.spots = [];
    this.renderEquipment(pc, "LeftHand", sx + EquipmentOffset, sy);
    this.renderEquipment(pc, "RightHand", sx + EquipmentOffset, sy + lh * 2);
    this.renderEquipment(pc, "Body", sx + EquipmentOffset, sy + lh * 4);
    this.renderEquipment(pc, "Special", sx + EquipmentOffset, sy + lh * 6);

    if (!inventory.length) return;
    const { offset, index } = this.resolveInventoryIndex();
    let y = sy;
    for (let i = 0; i < ItemsPerPage; i++) {
      const item = inventory[offset + i];
      if (!item) return;

      this.renderInventory(pc, item, sx + InventoryOffset, y, i === index);
      y += lh;
    }
  }

  resolveInventoryIndex() {
    if (this.cursorColumn === "equipment") return { offset: 0, index: NaN };

    const length = this.g.inventory.length;

    // TODO this happened once? lol
    if (isNaN(this.index)) this.index = 0;

    if (this.index >= length) this.index = length - 1;
    const index = this.index % ItemsPerPage;
    const offset = Math.floor(this.index / ItemsPerPage);

    return { offset, index };
  }

  renderStat(pc: Player, name: BoostableStat, x: number, y: number) {
    const stat = pc[name];
    const base = pc.getBaseStat(name);

    const { draw } = withTextStyle(this.g.ctx, {
      textAlign: "left",
      textBaseline: "top",
      fillStyle: "white",
    });

    draw(`${displayStatName[name]}:`, x, y);

    this.g.ctx.fillStyle =
      stat === base ? "white" : stat > base ? "green" : "red";
    draw(`${stat}`, x + StatOffset, y);
  }

  renderStatWithMax(pc: Player, name: "hp" | "sp", x: number, y: number) {
    const current = pc[name];
    const maxName = name === "hp" ? "maxHP" : "maxSP";
    const max = pc[maxName];
    const baseMax = pc.getBaseStat(maxName);

    const { draw, measure } = withTextStyle(this.g.ctx, {
      textAlign: "left",
      textBaseline: "top",
      fillStyle: "white",
    });

    draw(`${displayStatName[maxName]}:`, x, y);

    const currentStr = `${current}/`;
    const currentSize = measure(currentStr);
    draw(currentStr, x + StatOffset, y);

    this.g.ctx.fillStyle =
      max === baseMax ? "white" : max > baseMax ? "green" : "red";
    draw(`${max}`, x + StatOffset + currentSize.width, y);
  }

  renderEquipment(pc: Player, slot: PlayerEquipmentSlot, x: number, y: number) {
    const active =
      this.cursorColumn === "equipment" &&
      this.index === displaySlots.indexOf(slot);

    const { draw, lineHeight, measure } = withTextStyle(this.g.ctx, {
      textAlign: "left",
      textBaseline: "top",
      fillStyle: getItemColour(active, false),
    });

    draw(displaySlotName[slot], x, y);

    const item = pc[slot];
    if (item) {
      this.g.ctx.fillStyle = getItemColour(active, true);
      draw(item.name, x, y + lineHeight);

      const size = measure(item.name);
      this.spots.push({
        type: "equipment",
        slot,
        cursor: "pointer",
        x,
        y,
        ex: x + size.width,
        ey: y + lineHeight * 2,
      });
    }
  }

  renderInventory(
    pc: Player,
    item: Item,
    x: number,
    y: number,
    selected: boolean
  ) {
    const canEquip = pc.canEquip(item);

    const { draw, lineHeight, measure } = withTextStyle(this.g.ctx, {
      textAlign: "left",
      textBaseline: "top",
      fillStyle: getItemColour(selected, canEquip),
    });
    draw(item.name, x, y);

    const size = measure(item.name);
    this.spots.push({
      type: "inventory",
      item,
      cursor: "pointer",
      x,
      y,
      ex: x + size.width,
      ey: y + lineHeight,
    });
  }
}
