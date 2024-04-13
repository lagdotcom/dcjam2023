import { FontFamily, Pixels, Ratio } from "../types/flavours";

export default function withTextStyle(
  ctx: CanvasRenderingContext2D,
  {
    textAlign,
    textBaseline,
    fillStyle,
    fontSize = 10,
    fontFamily = "sans-serif",
    globalAlpha = 1,
  }: {
    textAlign: CanvasRenderingContext2D["textAlign"];
    textBaseline: CanvasRenderingContext2D["textBaseline"];
    fillStyle: CanvasRenderingContext2D["fillStyle"];
    fontSize?: Pixels;
    fontFamily?: FontFamily;
    globalAlpha?: Ratio;
  },
) {
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillStyle = fillStyle;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.globalAlpha = globalAlpha;

  return {
    lineHeight: (fontSize + 4) as Pixels,
    measure: (text: string) => ctx.measureText(text),
    draw: (text: string, x: Pixels, y: Pixels, maxWidth?: Pixels) =>
      ctx.fillText(text, x, y, maxWidth),
  };
}
