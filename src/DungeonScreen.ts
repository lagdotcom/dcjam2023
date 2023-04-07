import CombatRenderer from "./CombatRenderer";
import DungeonRenderer from "./DungeonRenderer";
import Engine from "./Engine";
import HUDRenderer from "./HUDRenderer";
import LogRenderer from "./LogRenderer";
import getKeyNames from "./tools/getKeyNames";
import withTextStyle from "./tools/withTextStyle";
import { GameScreen } from "./types/GameScreen";

interface RenderSetup {
  dungeon: DungeonRenderer;
  hud: HUDRenderer;
  log: LogRenderer;
  combat: CombatRenderer;
}

export default class DungeonScreen implements GameScreen {
  constructor(public g: Engine, public renderSetup: RenderSetup) {
    void g.jukebox.play("explore");
  }

  onKey(e: KeyboardEvent) {
    const keys = getKeyNames(e.code, e.shiftKey, e.altKey, e.ctrlKey);
    for (const key of keys) {
      const input = this.g.controls.get(key);
      if (input) {
        e.preventDefault();

        for (const check of input) {
          if (this.g.processInput(check)) return;
        }
      }
    }
  }

  render() {
    const { renderSetup } = this;
    const { canvas, ctx, res } = this.g;

    if (!renderSetup) {
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
      return;
    }

    renderSetup.dungeon.render();
    renderSetup.hud.render();
    if (this.g.showLog) renderSetup.log.render();
    if (this.g.combat.inCombat) renderSetup.combat.render();
  }
}
