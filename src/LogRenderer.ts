import Engine from "./Engine";
import { xy } from "./tools/geometry";

export default class LogRenderer {
  constructor(
    public g: Engine,
    public position = xy(304, 0),
    public size = xy(144, 160)
  ) {}

  render() {
    const { ctx, log } = this.g;

    const messages = log.slice(-5);

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    const textX = this.position.x + 3;
    let textY = this.position.y + this.size.y - 3;

    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";
    for (const m of messages) {
      // TODO this isn't going to work forever
      const draw = ctx.measureText(m);

      ctx.fillText(m, textX, textY, this.size.x - 6);
      textY -= draw.actualBoundingBoxAscent + draw.actualBoundingBoxDescent;
    }
  }
}
