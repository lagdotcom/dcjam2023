import Engine from "../Engine";
import withTextStyle from "../tools/withTextStyle";
import { GameScreen } from "../types/GameScreen";
import LoadGameScreen from "./LoadGameScreen";
import NewGameScreen from "./NewGameScreen";

export default class TitleScreen implements GameScreen {
  spotElements = [];

  constructor(public g: Engine) {
    void g.jukebox.play("title");
  }

  onKey(e: KeyboardEvent) {
    if (e.code === "KeyL") this.g.useScreen(new LoadGameScreen(this.g));
    if (e.code === "KeyN") this.g.useScreen(new NewGameScreen(this.g));
  }

  render() {
    const { canvas, ctx } = this.g;

    {
      const middle = canvas.width / 2;

      const { draw, lineHeight } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white",
        fontSize: 20,
      });
      draw("Poisoned Daggers", middle, 20);

      draw("(N)ew Game", middle, 80);
      draw("(L)oad Game", middle, 80 + lineHeight);
    }
  }
}
