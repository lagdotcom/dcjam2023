export default function withTextStyle(
  ctx: CanvasRenderingContext2D,
  {
    textAlign,
    textBaseline,
    fillStyle,
    fontSize = 10,
    fontFace = "sans-serif",
    globalAlpha = 1,
  }: {
    textAlign: CanvasRenderingContext2D["textAlign"];
    textBaseline: CanvasRenderingContext2D["textBaseline"];
    fillStyle: CanvasRenderingContext2D["fillStyle"];
    fontSize?: number;
    fontFace?: string;
    globalAlpha?: number;
  },
) {
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillStyle = fillStyle;
  ctx.font = `${fontSize}px ${fontFace}`;
  ctx.globalAlpha = globalAlpha;

  return {
    lineHeight: fontSize + 4,
    measure: (text: string) => ctx.measureText(text),
    draw: (text: string, x: number, y: number, maxWidth?: number) =>
      ctx.fillText(text, x, y, maxWidth),
  };
}
