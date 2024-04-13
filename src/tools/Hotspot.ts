import { CSSCursor, Pixels } from "../types/flavours";

export default interface Hotspot {
  x: Pixels;
  y: Pixels;
  ex: Pixels;
  ey: Pixels;
  cursor: CSSCursor;
}
