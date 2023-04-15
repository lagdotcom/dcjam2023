import sadFolksPng from "../../res/sad-folks.png";
import Engine from "../Engine";
import { xyi } from "../tools/geometry";
import { GameScreen } from "../types/GameScreen";
import HasHotspots from "../types/HasHotspots";
import XY from "../types/XY";
import TitleScreen from "./TitleScreen";

export default class SplashScreen implements GameScreen {
  image?: HTMLImageElement;
  position: XY;
  spotElements: HasHotspots[] = [];
  timeout: ReturnType<typeof setTimeout>;

  constructor(public g: Engine) {
    g.draw();

    this.position = xyi(g.canvas.width / 2, g.canvas.height / 2);
    this.timeout = setTimeout(this.next, 4000);

    void g.res.loadImage(sadFolksPng).then((img) => {
      this.image = img;
      this.position = xyi(
        g.canvas.width / 2 - img.width / 2,
        g.canvas.height / 2 - img.height / 2
      );
      g.draw();
      return img;
    });
  }

  onKey(e: KeyboardEvent) {
    e.preventDefault();
    this.next();
  }

  render() {
    if (!this.image) {
      // TODO
      // const { draw } = withTextStyle(this.g.ctx, {
      //   textAlign: "center",
      //   textBaseline: "middle",
      //   fontSize: 24,
      //   fillStyle: "white",
      // });
      // draw("Loading...", this.position.x, this.position.y);
      return;
    }

    this.g.ctx.drawImage(this.image, this.position.x, this.position.y);
  }

  next = () => {
    clearTimeout(this.timeout);

    this.g.screen = new TitleScreen(this.g);
  };
}