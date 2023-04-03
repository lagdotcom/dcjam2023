import Colours from "./Colours";
import Engine from "./Engine";
import Player from "./Player";
import XY from "./types/XY";
import withTextStyle from "./tools/withTextStyle";
import { xy } from "./tools/geometry";

const barWidth = 42;
const coordinates: XY[] = [
  xy(200, 124),
  xy(260, 166),
  xy(200, 210),
  xy(140, 166),
];

export default class StatsRenderer {
  constructor(
    public g: Engine,
    public text = xy(21, 36),
    public hp = xy(20, 43),
    public sp = xy(20, 49)
  ) {}

  render(bg: HTMLImageElement) {
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
    ctx.drawImage(bg, x, y);

    // TODO find a better way to highlight this
    const fg = index === this.g.facing ? "yellow" : "white";
    const { draw } = withTextStyle(ctx, "left", "middle", fg);
    draw(pc.name, x + text.x, y + text.y, barWidth);
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
