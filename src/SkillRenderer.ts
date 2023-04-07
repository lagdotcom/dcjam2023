import Engine from "./Engine";
import Hotspot from "./tools/Hotspot";
import { xy } from "./tools/geometry";
import withTextStyle from "./tools/withTextStyle";
import HasHotspots from "./types/HasHotspots";

export default class SkillRenderer implements HasHotspots {
  public spots: Hotspot[];

  constructor(
    public g: Engine,
    public position = xy(0, 0),
    public offset = xy(20, 42),
    public buttonSize = xy(80, 16),
    public rowHeight = 18
  ) {
    this.spots = [];
  }

  render() {
    if (this.g.combat.inCombat) return;

    const { buttonSize, offset, position, rowHeight } = this;
    const { draw } = withTextStyle(this.g.ctx, {
      textAlign: "left",
      textBaseline: "middle",
      fillStyle: "white",
    });

    const textX = position.x + offset.x;
    let textY = position.y + offset.y;

    for (let id = 0; id < 4; id++) {
      const pc = this.g.party[id];

      if (pc.alive) {
        draw(pc.skill, textX, textY);

        const x = textX - 10;
        const y = textY - 8;
        this.spots.push({
          id,
          x,
          y,
          ex: x + buttonSize.x,
          ey: y + buttonSize.y,
          cursor: "pointer",
        });
      }

      textY += rowHeight;
    }
  }

  spotClicked(spot: Hotspot): void {
    this.g.interact(spot.id);
  }
}
