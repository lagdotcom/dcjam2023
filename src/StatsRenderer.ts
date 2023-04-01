import Colours from "./Colours";
import Engine from "./Engine";
import Player from "./Player";
import XY from "./types/XY";
import withTextStyle from "./withTextStyle";
import { xy } from "./tools/geometry";

const boxWidth = 62;
const boxHeight = 30;
const coordinates: XY[] = [
  xy(145, 177),
  xy(225, 177),
  xy(145, 225),
  xy(225, 225),
];

export default class StatsRenderer {
  constructor(public g: Engine) {}

  render() {
    for (let i = 0; i < 4; i++) {
      const xy = coordinates[i];
      const pc = this.g.party[i];
      this.renderPC(xy, pc);
    }
  }

  renderPC({ x, y }: XY, pc: Player) {
    const { ctx } = this.g;

    ctx.fillStyle = Colours.background;
    ctx.fillRect(x, y, boxWidth, boxHeight);

    const { draw } = withTextStyle(ctx, "left", "middle", "white");
    draw(pc.name, x + 3, y + 10, boxWidth - 6);

    this.renderBar(x + 3, y + 18, pc.hp, pc.maxHp, Colours.hp);
    this.renderBar(x + 3, y + 24, pc.sp, pc.maxSp, Colours.sp);
  }

  renderBar(
    x: number,
    y: number,
    current: number,
    max: number,
    colour: string
  ) {
    const maxWidth = boxWidth - 6;
    const width = maxWidth * Math.max(0, Math.min(1, current / max));

    this.g.ctx.fillStyle = colour;
    this.g.ctx.fillRect(x, y, width, 3);

    this.g.ctx.fillStyle = Colours.background;
    this.g.ctx.fillRect(x, y, 1, 1);
    this.g.ctx.fillRect(x, y + 2, 1, 1);
    this.g.ctx.fillRect(x + width - 1, y, 1, 1);
    this.g.ctx.fillRect(x + width - 1, y + 2, 1, 1);
  }
}
