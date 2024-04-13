import Engine from "./Engine";
import { move, rotate } from "./tools/geometry";
import { XYTag, xyToTag } from "./tools/xyTags";
import Dir from "./types/Dir";
import { Cells } from "./types/flavours";
import XY from "./types/XY";

interface FovEntry {
  x: Cells;
  y: Cells;
  dx: Cells;
  dz: Cells;
  width: Cells;
  depth: Cells;
  leftVisible: boolean;
  rightVisible: boolean;
}

const facingDisplacements: Record<Dir, [Cells, Cells, Cells, Cells]> = {
  [Dir.E]: [0, 1, -1, 0],
  [Dir.N]: [1, 0, 0, 1],
  [Dir.S]: [-1, 0, 0, -1],
  [Dir.W]: [0, -1, 1, 0],
};

function getDisplacement(from: XY<Cells>, to: XY<Cells>, facing: Dir) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const [a, b, c, d] = facingDisplacements[facing];
  const x = dx * a + dy * b;
  const y = dx * c + dy * d;
  return [x, y];
}

class FovCalculator {
  entries: Map<XYTag, FovEntry>;

  constructor(public g: Engine) {
    this.entries = new Map();
  }

  calculate(width: Cells, depth: Cells) {
    const position = this.g.position;
    this.propagate(position, width, depth);

    return [...this.entries.values()].sort((a, b) => {
      const zd = a.dz - b.dz;
      if (zd) return zd;

      const xd = Math.abs(a.dx) - Math.abs(b.dx);
      return -xd;
    });
  }

  private displacement(position: XY<Cells>) {
    return getDisplacement(this.g.position, position, this.g.facing);
  }

  private propagate(position: XY<Cells>, width: Cells, depth: Cells) {
    if (width <= 0 || depth <= 0) return;

    const { g } = this;
    const { facing } = g;

    const tag = xyToTag(position);
    const old = this.entries.get(tag);
    if (old) {
      if (old.width >= width && old.depth >= depth) return;
    }

    const { x, y } = position;

    const cell = g.getCell(x, y);
    if (!cell) return;

    const [dx, dz] = this.displacement(position);
    const leftVisible = dx <= 0;
    const rightVisible = dx >= 0;
    this.entries.set(tag, {
      x,
      y,
      dx,
      dz,
      width,
      depth,
      leftVisible,
      rightVisible,
    });

    if (leftVisible) {
      const leftDir = rotate(facing, 3);
      const leftWall = cell.sides[leftDir];
      if (!leftWall?.wall)
        this.propagate(move(position, leftDir), width - 1, depth);
    }
    if (rightVisible) {
      const rightDir = rotate(facing, 1);
      const rightWall = cell.sides[rightDir];
      if (!rightWall?.wall)
        this.propagate(move(position, rightDir), width - 1, depth);
    }

    const forwardWall = cell.sides[facing];
    if (!forwardWall?.wall)
      this.propagate(move(position, facing), width, depth - 1);
  }
}

export default function getFieldOfView(g: Engine, width: Cells, depth: Cells) {
  const calc = new FovCalculator(g);
  return calc.calculate(width, depth);
}
