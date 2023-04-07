import Engine from "./Engine";
import withTextStyle from "./tools/withTextStyle";
import { GameScreen } from "./types/GameScreen";

export default class LoadingScreen implements GameScreen {
  constructor(public g: Engine) {
    g.draw();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onKey() {}

  render(): void {
    const { canvas, ctx, res } = this.g;

    const { draw } = withTextStyle(ctx, {
      textAlign: "center",
      textBaseline: "middle",
      fillStyle: "white",
    });
    draw(
      `Loading: ${res.loaded}/${res.loading}`,
      canvas.width / 2,
      canvas.height / 2
    );
    this.g.draw();
  }
}
