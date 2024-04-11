import Colours from "./Colours";
import Engine from "./Engine";
import { xy } from "./tools/geometry";
import withTextStyle from "./tools/withTextStyle";
import { Pixels } from "./types/flavours";

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
  x: Pixels,
  y: Pixels,
  ox: Pixels,
  oy: Pixels,
  w: Pixels,
  h: Pixels,
  tag: SideType,
) {
  ctx.fillStyle = sideColours[tag];
  ctx.fillRect(x + ox, y + oy, w, h);
}

export default class MinimapRenderer {
  constructor(
    public g: Engine,
    public tileSize: Pixels = 16,
    public wallSize: Pixels = 2,
    public size = xy<Pixels>(2, 2),
    public position = xy<Pixels>(375, 170),
  ) {}

  render() {
    const { tileSize, size, position, wallSize } = this;
    const { ctx, facing, position: partyPos } = this.g;

    const startX = position.x;
    const startY = position.y;
    let dx = 0;
    let dy = startY;

    for (let y = -size.y; y <= size.y; y++) {
      const ty = y + partyPos.y;
      dx = startX - tileSize;
      for (let x = -size.x; x <= size.x; x++) {
        const tx = x + partyPos.x;
        dx += tileSize;

        const { cell, north, east, south, west } = this.g.getMinimapData(
          tx,
          ty,
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

        if (cell?.object) {
          const { draw } = withTextStyle(ctx, {
            textAlign: "center",
            textBaseline: "middle",
            fillStyle: "white",
            fontSize: tileSize,
          });
          draw("●", dx + tileSize / 2, dy + tileSize / 2);
        }
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
      startY + tileSize * (size.y + 0.5),
    );
  }
}
