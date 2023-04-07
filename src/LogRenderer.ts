import Colours from "./Colours";
import Engine from "./Engine";
import textWrap from "./tools/textWrap";
import withTextStyle from "./tools/withTextStyle";
import { xy } from "./tools/geometry";

export default class LogRenderer {
  constructor(
    public g: Engine,
    public position = xy(276, 0),
    public size = xy(204, 270),
    public padding = xy(2, 2)
  ) {}

  render() {
    const { padding, position, size } = this;
    const { ctx, log } = this.g;

    ctx.fillStyle = Colours.logShadow;
    ctx.fillRect(position.x, position.y, size.x, size.y);

    const width = size.x - padding.x * 2;
    const textX = position.x + padding.x;
    let textY = position.y + size.y - padding.y;

    const { lineHeight, measure, draw } = withTextStyle(ctx, {
      textAlign: "left",
      textBaseline: "bottom",
      fillStyle: "white",
    });
    for (let i = log.length - 1; i >= 0; i--) {
      const { lines } = textWrap(log[i], width, measure);

      for (const line of lines.reverse()) {
        draw(line, textX, textY);
        textY = textY - lineHeight;

        if (textY < position.y) return;
      }
    }
  }
}
