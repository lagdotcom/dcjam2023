import Colours from "./Colours";
import Engine from "./Engine";
import Player from "./Player";
import { lerpXY, xy } from "./tools/geometry";
import Hotspot from "./tools/Hotspot";
import withTextStyle from "./tools/withTextStyle";
import Dir from "./types/Dir";
import { Colour, Milliseconds, Pixels, Ratio } from "./types/flavours";
import HasHotspots from "./types/HasHotspots";
import XY from "./types/XY";

type SwapData = { from: Dir; to: Dir }[];

const barWidth: Pixels = 38;
const coordinates: XY<Pixels>[] = [
  xy(214, 138),
  xy(274, 180),
  xy(214, 224),
  xy(154, 180),
];

class MarbleAnimator {
  progress: Ratio;
  swaps: SwapData;
  timeout?: ReturnType<typeof setInterval>;

  constructor(
    public parent: StatsRenderer,
    public interval: Milliseconds = 50,
    public progressTick: Ratio = 0.2,
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

type Spot = Hotspot & { dir: Dir };

export default class StatsRenderer implements HasHotspots {
  spots: Spot[];
  animator: MarbleAnimator;
  positions: XY<Pixels>[];

  constructor(
    public g: Engine,
    public text = xy<Pixels>(25, 21),
    public hp = xy<Pixels>(7, 29),
    public sp = xy<Pixels>(7, 35),
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

  renderPC({ x, y }: XY<Pixels>, pc: Player, bg: HTMLImageElement, dir: Dir) {
    const { text, hp, sp } = this;
    const { ctx } = this.g;

    this.renderBar(x + hp.x, y + hp.y, pc.hp, pc.maxHP, Colours.hp);
    this.renderBar(x + sp.x, y + sp.y, pc.sp, pc.maxSP, Colours.sp);

    ctx.globalAlpha = dir === this.g.facing ? 1 : 0.7;
    ctx.drawImage(bg, x, y);
    ctx.globalAlpha = 1;

    const { draw } = withTextStyle(ctx, {
      textAlign: "center",
      textBaseline: "middle",
      fillStyle: "white",
    });
    draw(pc.name, x + bg.width / 2, y + text.y, barWidth);

    this.spots.push({
      dir,
      x,
      y,
      ex: x + bg.width,
      ey: y + bg.height,
      cursor: "pointer",
    });
  }

  spotClicked(spot: Spot) {
    this.g.pcClicked(spot.dir);
  }

  renderBar<T extends number>(
    x: Pixels,
    y: Pixels,
    current: T,
    max: T,
    colour: Colour,
  ) {
    const width = Math.floor(
      barWidth * Math.max(0, Math.min(1, current / max)),
    );

    this.g.ctx.fillStyle = colour;
    this.g.ctx.fillRect(x, y, width, 3);
  }
}
