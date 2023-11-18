import baseUrl from "../res/hud/base.png";
import buttonsUrl from "../res/hud/buttons.png";
import mapBorderUrl from "../res/hud/map-border.png";
import marbleUrl from "../res/hud/marble.png";
import ringUrl from "../res/hud/ring.png";
import Engine from "./Engine";
import MinimapRenderer from "./MinimapRenderer";
import SkillRenderer from "./SkillRenderer";
import StatsRenderer from "./StatsRenderer";
import { xyi } from "./tools/geometry";
import withTextStyle from "./tools/withTextStyle";
import XY from "./types/XY";

type HUDData<T> = { base: T; buttons: T; mapBorder: T; marble: T; ring: T };

const empty = document.createElement("img");
const zero = xyi(0, 0);

class RollListener {
  value: number;
  colour: string;
  opacity: number;
  timer?: ReturnType<typeof setTimeout>;

  constructor(
    public g: Engine,
    public position = xyi(g.canvas.width / 2, 212),
    public initialDelay = 2000,
    public fadeDelay = 500,
  ) {
    this.value = 0;
    this.colour = "white";
    this.opacity = 0;
    this.g.eventHandlers.onRoll.add(({ value, size }) =>
      this.rolled(
        value,
        value === 1 ? "red" : value === size ? "lime" : "white",
      ),
    );
  }

  rolled(value: number, colour: string) {
    this.value = value;
    this.colour = colour;
    this.opacity = 1;

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.tick, this.initialDelay);
    this.g.draw();
  }

  tick = () => {
    this.opacity = this.opacity > 0.1 ? (this.opacity /= 2) : 0;
    this.g.draw();

    this.timer = this.opacity
      ? setTimeout(this.tick, this.fadeDelay)
      : undefined;
  };

  render() {
    if (this.opacity) {
      const { draw } = withTextStyle(this.g.ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: this.colour,
        fontSize: 16,
        globalAlpha: this.opacity,
      });
      draw(this.value.toString(), this.position.x, this.position.y);

      // TODO figure this out later
      this.g.ctx.globalAlpha = 1;
    }
  }
}

export default class HUDRenderer {
  images: HUDData<HTMLImageElement>;
  positions: HUDData<XY>;
  stats: StatsRenderer;
  minimap: MinimapRenderer;
  roll: RollListener;
  skills: SkillRenderer;

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
    this.roll = new RollListener(g);
    this.skills = new SkillRenderer(g);
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

    this.positions = {
      base: zero,
      buttons: xyi(32, height - buttons.height),
      mapBorder: xyi(width - mapBorder.width, height - mapBorder.height),
      marble: zero, // not used
      ring: xyi((width - ring.width) / 2 - 2, height - ring.height),
    };

    this.skills.position = this.positions.buttons;

    return this.images;
  }

  paste(image: keyof HUDData<unknown>) {
    const pos = this.positions[image];
    this.g.ctx.drawImage(this.images[image], pos.x, pos.y);
  }

  render() {
    this.paste("base");
    this.paste("ring");
    this.roll.render();
    this.stats.render(this.images.marble);
    this.minimap.render();
    this.paste("mapBorder");
    this.paste("buttons");
    this.skills.render();
  }
}
