import Engine from "./Engine";

export default class HUDRenderer {
  constructor(public g: Engine, public img: HTMLImageElement) {}

  render() {
    this.g.ctx.drawImage(this.img, 0, 0);
  }
}
