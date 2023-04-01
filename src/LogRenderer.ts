import Engine from "./Engine";
import textWrap from "./tools/textWrap";
import { xy } from "./tools/geometry";

export default class LogRenderer {
  constructor(
    public g: Engine,
    public position = xy(304, 0),
    public size = xy(144, 160)
  ) {}

  render() {
    const { ctx, log } = this.g;

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    const textX = this.position.x + 3;
    let textY = this.position.y + this.size.y - 3;

    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";

    for (let i = log.length - 1; i >= 0; i--) {
      const { lines, measurement } = textWrap(ctx, log[i], this.size.x - 6);

      for (const line of lines.reverse()) {
        ctx.fillText(line, textX, textY);
        textY = Math.floor(
          textY -
            measurement.actualBoundingBoxAscent +
            measurement.actualBoundingBoxDescent
        );

        if (textY < this.position.y) return;
      }
    }
  }
}
