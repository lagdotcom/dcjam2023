import { startGame } from "../analytics";
import classes from "../classes";
import { getItemColour } from "../Colours";
import Engine from "../Engine";
import EngineInkScripting from "../EngineInkScripting";
import Player from "../Player";
import { anySavedGamesExist } from "../saves";
import { wrap } from "../tools/numbers";
import textWrap from "../tools/textWrap";
import withTextStyle from "../tools/withTextStyle";
import { ClassName, ClassNames } from "../types/ClassName";
import { GameScreen } from "../types/GameScreen";
import TitleScreen from "./TitleScreen";

export default class NewGameScreen implements GameScreen {
  index: number;
  selected: Set<ClassName>;
  spotElements = [];

  constructor(public g: Engine) {
    void g.jukebox.play("title");
    g.log = [];
    g.pendingArenaEnemies = [];
    g.pendingNormalEnemies = [];
    g.scripting = new EngineInkScripting(g);
    g.showLog = false;
    g.map.clear();

    this.index = 0;
    this.selected = new Set();
  }

  onKey(e: KeyboardEvent): void {
    this.g.jukebox.tryPlay();

    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        e.preventDefault();
        this.g.draw();
        this.index = wrap(this.index - 1, ClassNames.length);
        break;
      case "ArrowDown":
      case "KeyS":
        e.preventDefault();
        this.g.draw();
        this.index = wrap(this.index + 1, ClassNames.length);
        break;

      case "Enter":
      case "Return": {
        e.preventDefault();
        this.g.draw();
        const cn = ClassNames[this.index];
        if (this.selected.has(cn)) this.selected.delete(cn);
        else if (this.selected.size < 4) this.selected.add(cn);
        break;
      }

      case "Space":
        e.preventDefault();
        if (this.selected.size === 4) {
          // TODO there must be more state to reset...
          this.g.inventory = [];
          this.g.party = [];
          for (const cn of this.selected)
            this.g.party.push(new Player(this.g, cn));

          startGame(this.selected);
          void this.g.loadGCMap("map.json", 0, -1);
        }
        break;

      case "Escape":
        if (anySavedGamesExist()) this.g.useScreen(new TitleScreen(this.g));
        break;
    }
  }

  render(): void {
    const { index, selected } = this;
    const { canvas, ctx } = this.g;

    {
      const { draw } = withTextStyle(ctx, {
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: "white",
        fontSize: 20,
      });
      draw("Poisoned Daggers", canvas.width / 2, 20);

      draw(
        selected.size === 4 ? "Press Space to begin" : "Pick 4 with Enter",
        canvas.width / 2,
        canvas.height - 20,
      );
    }

    {
      const { draw, lineHeight, measure } = withTextStyle(ctx, {
        textAlign: "left",
        textBaseline: "middle",
        fillStyle: "white",
      });

      let y = 60;
      for (let i = 0; i < ClassNames.length; i++) {
        const cn = ClassNames[i];
        ctx.fillStyle = getItemColour(i === index, selected.has(cn));

        draw(cn, 20, y);
        y += lineHeight * 2;
      }

      const cn = ClassNames[this.index];
      const cl = classes[cn];
      ctx.fillStyle = "white";
      draw(cl.name, 100, 60);

      y = 60 + lineHeight * 2;
      for (const line of textWrap(cl.lore, canvas.width - 120, measure).lines) {
        draw(line, 100, y);
        y += lineHeight;
      }
    }
  }
}
