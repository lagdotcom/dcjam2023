import Colours from "./Colours";
import Engine from "./Engine";
import Player from "./Player";
import XY from "./types/XY";
import withTextStyle from "./tools/withTextStyle";
import { lerpXY, xy } from "./tools/geometry";
import Hotspot from "./tools/Hotspot";
import HasHotspots from "./types/HasHotspots";
import Dir from "./types/Dir";

type SwapData = { from: Dir; to: Dir }[];

const barWidth = 38;
const coordinates: XY[] = [
  xy(200, 124),
  xy(260, 166),
  xy(200, 210),
  xy(140, 166),
];

class MarbleAnimator {
  progress: number;
  swaps: SwapData;
  timeout?: ReturnType<typeof setInterval>;

  constructor(
    public parent: StatsRenderer,
    public interval = 50,
    public progressTick = 0.2
  ) {
    this.progress = 0;
    this.swaps = [];
  }

  handle(swaps: SwapData) {
    if (!this.timeout) this.timeout = setInterval(this.tick, this.interval);

    this.swaps = swaps;
    this.progress = 0;
    this.parent.positions = this.getPositions();
  }

  getPositions() {
    const positions = coordinates.slice();
    for (const { from, to } of this.swaps) {
      positions[to] = lerpXY(coordinates[from], coordinates[to], this.progress);
    }
    return positions;
  }

  tick = () => {
    this.parent.g.draw();

    this.progress += this.progressTick;
    if (this.progress >= 1) {
      clearInterval(this.timeout);
      this.timeout = undefined;
    }

    this.parent.positions = this.getPositions();
  };
}

export default class StatsRenderer implements HasHotspots {
  public spots: Hotspot[];
  animator: MarbleAnimator;
  positions: XY[];

  constructor(
    public g: Engine,
    public text = xy(21, 36),
    public hp = xy(22, 43),
    public sp = xy(22, 49)
  ) {
    this.animator = new MarbleAnimator(this);
    this.spots = [];
    this.positions = coordinates;
    g.eventHandlers.onPartySwap.add((e) => this.animator.handle(e.swaps));
  }

  render(bg: HTMLImageElement) {
    this.spots = [];

    for (let i = 0; i < 4; i++) {
      const xy = this.positions[i];
      const pc = this.g.party[i];
      this.renderPC(xy, pc, bg, i);
    }
  }

  renderPC({ x, y }: XY, pc: Player, bg: HTMLImageElement, index: number) {
    const { text, hp, sp } = this;
    const { ctx } = this.g;

    this.renderBar(x + hp.x, y + hp.y, pc.hp, pc.maxHP, Colours.hp);
    this.renderBar(x + sp.x, y + sp.y, pc.sp, pc.maxSP, Colours.sp);

    ctx.globalAlpha = index === this.g.facing ? 1 : 0.7;
    ctx.drawImage(bg, x, y);
    ctx.globalAlpha = 1;

    const { draw } = withTextStyle(ctx, {
      textAlign: "center",
      textBaseline: "middle",
      fillStyle: "white",
    });
    draw(pc.name, x + bg.width / 2, y + text.y, barWidth);

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
