import { getItemColour } from "../Colours";
import Engine from "../Engine";
import { getSavedGames } from "../saves";
import { xyi } from "../tools/geometry";
import { wrap } from "../tools/numbers";
import withTextStyle from "../tools/withTextStyle";
import { GameScreen } from "../types/GameScreen";
import TitleScreen from "./TitleScreen";

const SaveHeight = 60;

export default class LoadGameScreen implements GameScreen {
  spotElements = [];

  constructor(
    public g: Engine,
    public games = getSavedGames(),
    public index = 0,
    public position = xyi(60, 60)
  ) {
    void g.jukebox.play("title");
  }

  onKey(e: KeyboardEvent) {
    switch (e.code) {
      case "Escape":
        this.g.useScreen(new TitleScreen(this.g));
        return;

      case "ArrowUp":
      case "KeyW":
        this.index = wrap(this.index - 1, this.games.length);
        return this.g.draw();

      case "ArrowDown":
      case "KeyS":
        this.index = wrap(this.index + 1, this.games.length);
        return this.g.draw();

      case "Enter":
      case "Return":
        return this.tryLoad(this.index);

      case "Digit1":
      case "Numpad1":
        return this.tryLoad(0);
      case "Digit2":
      case "Numpad2":
        return this.tryLoad(1);
      case "Digit3":
      case "Numpad3":
        return this.tryLoad(2);

      default:
        console.log(e.code);
    }
  }

  tryLoad(index: number) {
    const game = this.games[index];
    if (game) void this.g.load(game);
  }

  render() {
    const { games, index, position } = this;
    const { canvas, ctx } = this.g;

    {
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white",
        fontSize: 20,
      });
      draw("Poisoned Daggers", canvas.width / 2, 20);
    }

    const { draw, lineHeight } = withTextStyle(ctx, {
      textAlign: "left",
      textBaseline: "middle",
      fillStyle: "white",
    });
    const x = position.x;
    let y = position.y;

    for (let i = 0; i < games.length; i++) {
      const highlighted = i === index;
      const game = games[i];

      if (!game) {
        ctx.fillStyle = getItemColour(false, highlighted);
        draw(`${i + 1}. -`, x, y);
      } else {
        ctx.fillStyle = getItemColour(true, highlighted);
        draw(`${i + 1}. ${game.name}`, x, y);

        ctx.fillStyle = "white";
        draw(game.party.map((p) => p.name).join(", "), x, y + lineHeight);
      }

      y += SaveHeight;
    }
  }
}
