import Colours from "./Colours";
import Engine from "./Engine";
import withTextStyle from "./tools/withTextStyle";
import { xy } from "./tools/geometry";

const facingChars = ["^", ">", "v", "<"];

const sideColours = {
  "": "white",
  d: "silver",
  s: "grey",
  w: "orange",
  ds: "silver",
  dw: "red",
  sw: "black",
  dsw: "silver",
};

type SideType = keyof typeof sideColours;

function rect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ox: number,
  oy: number,
  w: number,
  h: number,
  tag: SideType
) {
  ctx.fillStyle = sideColours[tag];
  ctx.fillRect(x + ox, y + oy, w, h);
}

export default class MinimapRenderer {
  constructor(
    public g: Engine,
    public tileSize = 16,
    public wallSize = 2,
    public size = xy(2, 2),
    public position = xy(375, 170)
  ) {}

  render() {
    const { tileSize, size, position, wallSize } = this;
    const { ctx, facing, position: partyPos } = this.g;

    const startX = position.x;
    const startY = position.y;
    let dx = 0;
    let dy = startY;

    // ctx.fillStyle = Colours.background;
    // ctx.fillRect(
    //   startX,
    //   startY,
    //   tileSize * (size.x * 2 + 1),
    //   tileSize * (size.y * 2 + 1)
    // );

    for (let y = -size.y; y <= size.y; y++) {
      const ty = y + partyPos.y;
      dx = startX - tileSize;
      for (let x = -size.x; x <= size.x; x++) {
        const tx = x + partyPos.x;
        dx += tileSize;

        const { cell, north, east, south, west } = this.g.getMinimapData(
          tx,
          ty
        );
        if (cell) {
          ctx.fillStyle = Colours.mapVisited;
          ctx.fillRect(dx, dy, tileSize, tileSize);
        }

        const edge = tileSize - wallSize;
        if (north) rect(ctx, dx, dy, 0, 0, tileSize, wallSize, north);
        if (east) rect(ctx, dx, dy, edge, 0, wallSize, tileSize, east);
        if (south) rect(ctx, dx, dy, 0, edge, tileSize, wallSize, south);
        if (west) rect(ctx, dx, dy, 0, 0, wallSize, tileSize, west);
      }

      dy += tileSize;
    }

    const { draw } = withTextStyle(ctx, {
      textAlign: "center",
      textBaseline: "middle",
      fillStyle: "white",
    });
    draw(
      facingChars[facing],
      startX + tileSize * (size.x + 0.5),
      startY + tileSize * (size.y + 0.5)
    );
  }
}
