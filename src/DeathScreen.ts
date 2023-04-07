import Engine from "./Engine";
import Player from "./Player";
import TitleScreen from "./TitleScreen";
import classes from "./classes";
import textWrap from "./tools/textWrap";
import withTextStyle from "./tools/withTextStyle";
import { GameScreen } from "./types/GameScreen";

export default class DeathScreen implements GameScreen {
  alpha: number;
  doNotClear: boolean;
  interval: ReturnType<typeof setInterval>;
  oldScreen: GameScreen;

  constructor(public g: Engine, public lastToDie: Player) {
    g.draw();
    g.jukebox.stop();
    g.spotElements = [];

    this.alpha = 0.1;
    this.doNotClear = true;
    this.interval = setInterval(this.render, 400);
    this.oldScreen = g.screen;
  }

  onKey(e: KeyboardEvent) {
    if (e.code === "Escape") {
      this.g.screen = new TitleScreen(this.g);
      if (this.interval) clearInterval(this.interval);
    }
  }

  render = () => {
    const { width, height } = this.g.canvas;
    const { ctx } = this.g;

    if (this.alpha < 1) {
      this.oldScreen.render();

      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      this.alpha += 0.1;
      if (this.alpha >= 1) {
        clearInterval(this.interval);
        this.doNotClear = false;
      }
    }

    const { draw, lineHeight, measure } = withTextStyle(ctx, {
      textAlign: "center",
      textBaseline: "middle",
      fillStyle: "white",
    });

    const { lines, measurement } = textWrap(
      classes[this.lastToDie.className].deathQuote,
      width - 200,
      measure
    );
    const textHeight = lines.length * lineHeight;
    console.log(measurement);

    let y = height / 2 - textHeight / 2;
    for (const line of lines) {
      draw(line, width / 2, y);
      y += lineHeight;
    }

    ctx.globalAlpha = 1;
  };
}
