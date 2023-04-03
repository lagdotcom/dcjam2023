import Colours from "./Colours";
import Engine from "./Engine";
import Player from "./Player";
import XY from "./types/XY";
import withTextStyle from "./tools/withTextStyle";
import { xy } from "./tools/geometry";
import Hotspot from "./tools/Hotspot";
import HasHotspots from "./types/HasHotspots";

const barWidth = 38;
const coordinates: XY[] = [
  xy(200, 124),
  xy(260, 166),
  xy(200, 210),
  xy(140, 166),
];

export default class StatsRenderer implements HasHotspots {
  public spots: Hotspot[];

  constructor(
    public g: Engine,
    public text = xy(21, 36),
    public hp = xy(22, 43),
    public sp = xy(22, 49)
  ) {
    this.spots = [];
  }

  render(bg: HTMLImageElement) {
    this.spots = [];

    for (let i = 0; i < 4; i++) {
      const xy = coordinates[i];
      const pc = this.g.party[i];
      this.renderPC(xy, pc, bg, i);
    }
  }

  renderPC({ x, y }: XY, pc: Player, bg: HTMLImageElement, index: number) {
    const { text, hp, sp } = this;
    const { ctx } = this.g;

    this.renderBar(x + hp.x, y + hp.y, pc.hp, pc.maxHp, Colours.hp);
    this.renderBar(x + sp.x, y + sp.y, pc.sp, pc.maxSp, Colours.sp);

    ctx.globalAlpha = index === this.g.facing ? 1 : 0.7;
    ctx.drawImage(bg, x, y);
    ctx.globalAlpha = 1;

    const { draw } = withTextStyle(ctx, {
      textAlign: "left",
      textBaseline: "middle",
      fillStyle: "white",
    });
    draw(pc.name, x + text.x, y + text.y, barWidth);

    this.spots.push({
      id: index,
      x,
      y,
      ex: x + bg.width,
      ey: y + bg.height,
      cursor: "pointer",
    });
  }

  spotClicked(spot: Hotspot) {
    const pos = spot.id;
    if (this.g.facing !== pos) this.g.partySwap(pos - this.g.facing);
  }

  renderBar(
    x: number,
    y: number,
    current: number,
    max: number,
    colour: string
  ) {
    const width = Math.floor(
      barWidth * Math.max(0, Math.min(1, current / max))
    );

    this.g.ctx.fillStyle = colour;
    this.g.ctx.fillRect(x, y, width, 3);
  }
}
