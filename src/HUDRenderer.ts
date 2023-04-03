import Engine from "./Engine";

import baseUrl from "../res/hud/base.png";
import buttonsUrl from "../res/hud/buttons.png";
import mapBorderUrl from "../res/hud/map-border.png";
import marbleUrl from "../res/hud/marble.png";
import ringUrl from "../res/hud/ring.png";
import StatsRenderer from "./StatsRenderer";
import MinimapRenderer from "./MinimapRenderer";
import XY from "./types/XY";
import { xyi } from "./tools/geometry";

type HUDData<T> = { base: T; buttons: T; mapBorder: T; marble: T; ring: T };

const empty = document.createElement("img");
const zero = xyi(0, 0);

export default class HUDRenderer {
  images: HUDData<HTMLImageElement>;
  positions: HUDData<XY>;
  stats: StatsRenderer;
  minimap: MinimapRenderer;

  constructor(public g: Engine) {
    this.images = {
      base: empty,
      buttons: empty,
      mapBorder: empty,
      marble: empty,
      ring: empty,
    };
    this.positions = {
      base: zero,
      buttons: zero,
      mapBorder: zero,
      marble: zero,
      ring: zero,
    };

    this.stats = new StatsRenderer(g);
    this.minimap = new MinimapRenderer(g);
  }

  async acquireImages() {
    const [base, buttons, mapBorder, marble, ring] = await Promise.all([
      this.g.res.loadImage(baseUrl),
      this.g.res.loadImage(buttonsUrl),
      this.g.res.loadImage(mapBorderUrl),
      this.g.res.loadImage(marbleUrl),
      this.g.res.loadImage(ringUrl),
    ]);

    const { width, height } = this.g.canvas;

    this.images = { base, buttons, mapBorder, marble, ring };
    const ringPos = xyi((width - ring.width) / 2, height - ring.height);

    this.positions = {
      base: xyi(0, 0),
      buttons: xyi(32, height - buttons.height),
      mapBorder: xyi(width - mapBorder.width, height - mapBorder.height),
      marble: zero, // not used
      ring: ringPos,
    };

    return this.images;
  }

  paste(image: keyof HUDData<unknown>) {
    const pos = this.positions[image];
    this.g.ctx.drawImage(this.images[image], pos.x, pos.y);
  }

  render() {
    this.paste("base");
    this.paste("ring");
    this.stats.render(this.images.marble);
    this.minimap.render();
    this.paste("mapBorder");
    this.paste("buttons");
  }
}
