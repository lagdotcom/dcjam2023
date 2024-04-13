import { Choice } from "inkjs/engine/Choice";

import Colours, { getItemColour } from "../Colours";
import Engine from "../Engine";
import { xy } from "../tools/geometry";
import { wrap } from "../tools/numbers";
import textWrap from "../tools/textWrap";
import withTextStyle from "../tools/withTextStyle";
import { Pixels } from "../types/flavours";
import { GameScreen } from "../types/GameScreen";

export default class DialogChoiceScreen implements GameScreen {
  background: GameScreen;
  index: number;
  resolve?: (choice: Choice) => void;
  spotElements = [];

  constructor(
    public g: Engine,
    public prompt: string,
    public choices: Choice[],
    public position = xy<Pixels>(91, 21),
    public size = xy<Pixels>(296, 118),
    public padding = xy<Pixels>(20, 20),
  ) {
    this.index = 0;
    this.background = g.screen;
  }

  onKey(e: KeyboardEvent): void {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.index = wrap(this.index - 1, this.choices.length);
        return this.g.draw();

      case "ArrowDown":
      case "KeyS":
        this.index = wrap(this.index + 1, this.choices.length);
        return this.g.draw();

      case "Enter":
      case "Return":
        this.resolve?.(this.choices[this.index]);
        return this.g.useScreen(this.background);
    }
  }

  render(): void {
    this.background.render();

    const { choices, index, padding, position, prompt, size } = this;
    const { ctx } = this.g;

    ctx.fillStyle = Colours.logShadow;
    ctx.fillRect(position.x, position.y, size.x, size.y);

    const { draw, measure, lineHeight } = withTextStyle(ctx, {
      textAlign: "left",
      textBaseline: "middle",
      fillStyle: "white",
    });

    const width = size.x - padding.x * 2;
    const x = position.x + padding.x;
    let y = position.y + padding.y;

    const title = textWrap(prompt, width, measure);
    for (const line of title.lines) {
      draw(line, x, y);
      y += lineHeight;
    }

    for (let i = 0; i < choices.length; i++) {
      const choice = textWrap(choices[i].text, width, measure);
      ctx.fillStyle = getItemColour(i === index, true);

      for (const line of choice.lines) {
        draw(line, x, y);
        y += lineHeight;
      }
    }
  }

  async run() {
    return new Promise<Choice>((resolve) => {
      this.resolve = resolve;
    });
  }
}
