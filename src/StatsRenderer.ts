import Engine from "./Engine";
import Player from "./Player";
import XY from "./types/XY";
import { xy } from "./tools/geometry";

const hpColour = "rgb(223,113,38)";
const spColour = "rgb(99,155,255)";

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

    ctx.fillStyle = "rgb(64,64,64)";
    ctx.fillRect(x, y, 62, 30);

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(pc.name, x + 3, y + 10, 62 - 6);

    this.renderBar(x + 3, y + 18, pc.hp, pc.maxHp, hpColour);
    this.renderBar(x + 3, y + 24, pc.sp, pc.maxSp, spColour);
  }

  renderBar(
    x: number,
    y: number,
    current: number,
    max: number,
    colour: string
  ) {
    const maxWidth = 62 - 6;
    const width = maxWidth * Math.max(0, Math.min(1, current / max));

    this.g.ctx.fillStyle = colour;
    this.g.ctx.fillRect(x, y, width, 3);
  }
}
