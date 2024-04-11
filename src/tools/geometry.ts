import Dir from "../types/Dir";
import { Quadrants, Ratio } from "../types/flavours";
import XY from "../types/XY";

export const xy = <T extends number>(x: T, y: T): XY<T> => ({ x, y });
export const xyi = <T extends number>(x: T, y: T): XY<T> =>
  ({
    x: Math.floor(x),
    y: Math.floor(y),
  }) as XY<T>;

export function sameXY<T extends number>(a: XY<T>, b: XY<T>) {
  return a.x === b.x && a.y === b.y;
}

export function addXY<T extends number>(a: XY<T>, b: XY<T>): XY<T> {
  return { x: a.x + b.x, y: a.y + b.y } as XY<T>;
}

const displacements: XY<number>[] = [xy(0, -1), xy(1, 0), xy(0, 1), xy(-1, 0)];
export function move<T extends number>(pos: XY<T>, dir: Dir): XY<T> {
  return addXY(pos, displacements[dir] as XY<T>);
}

export function rotate(dir: Dir, clockwise: Quadrants): Dir {
  return (dir + clockwise + 4) % 4;
}

export function dirFromInitial(initial: string): Dir {
  switch (initial) {
    case "E":
      return Dir.E;
    case "S":
      return Dir.S;
    case "W":
      return Dir.W;
    case "N":
    default:
      return Dir.N;
  }
}

export function getCardinalOffset<T extends number>(
  start: XY<T>,
  destination: XY<T>,
) {
  const dx = destination.x - start.x;
  const dy = destination.y - start.y;

  if (dx && dy) return;
  if (dy < 0) return { dir: Dir.N, offset: -dy };
  if (dx > 0) return { dir: Dir.E, offset: dx };
  if (dy > 0) return { dir: Dir.S, offset: dy };
  if (dx < 0) return { dir: Dir.W, offset: -dx };
}

const dirOffsets = {
  [Dir.N]: { [Dir.N]: 0, [Dir.E]: 1, [Dir.S]: 2, [Dir.W]: 3 },
  [Dir.E]: { [Dir.N]: 3, [Dir.E]: 0, [Dir.S]: 1, [Dir.W]: 2 },
  [Dir.S]: { [Dir.N]: 2, [Dir.E]: 3, [Dir.S]: 0, [Dir.W]: 1 },
  [Dir.W]: { [Dir.N]: 1, [Dir.E]: 2, [Dir.S]: 3, [Dir.W]: 0 },
} as const;

export function getDirOffset(start: Dir, end: Dir) {
  return dirOffsets[start][end];
}

export function lerpXY<T extends number>(from: XY<T>, to: XY<T>, ratio: Ratio) {
  if (ratio <= 0) return from;
  if (ratio >= 1) return to;

  const fr = 1 - ratio;

  return xy(from.x * fr + to.x * ratio, from.y * fr + to.y * ratio);
}
