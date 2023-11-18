import Colours from "./Colours";
import Engine from "./Engine";
import { xy } from "./tools/geometry";
import withTextStyle from "./tools/withTextStyle";

export default class CombatRenderer {
  constructor(
    public g: Engine,
    public position = xy(60, 0),
    public size = xy(144, 160),
    public padding = xy(2, 2),
    public rowPadding = 5,
  ) {}

  render() {
    const { padding, position, rowPadding, size } = this;
    const { combat, ctx, facing, party } = this.g;

    const active = combat.side === "player" ? party[facing] : undefined;

    if (active?.alive) {
      ctx.fillStyle = Colours.logShadow;
      ctx.fillRect(position.x, position.y, size.x, size.y);

      const { draw, lineHeight } = withTextStyle(ctx, {
        textAlign: "left",
        textBaseline: "middle",
        fillStyle: "white",
      });
      const x = position.x;
      let y = position.y + padding.y + lineHeight / 2;

      draw(`${active.name} has ${active.sp}SP:`, x + padding.x, y);
      y += lineHeight;

      const rowHeight = lineHeight + rowPadding * 2;
      const actions = active.actions;
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const possible = this.g.canAct(active, action);

        if (i === combat.index) {
          ctx.fillStyle = possible
            ? Colours.majorHighlight
            : Colours.minorHighlight;
          ctx.fillRect(x, y, size.x, rowHeight);
        }

        ctx.fillStyle = possible ? "white" : "silver";
        draw(
          `${action.name} (${action.sp})`,
          x + padding.x,
          y + rowHeight / 2,
          undefined,
        );
        y += rowHeight;
      }
    }
  }
}
