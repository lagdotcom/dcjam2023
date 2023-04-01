export default function withTextStyle(
  ctx: CanvasRenderingContext2D,
  textAlign: CanvasRenderingContext2D["textAlign"],
  textBaseline: CanvasRenderingContext2D["textBaseline"],
  fillStyle: CanvasRenderingContext2D["fillStyle"]
) {
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillStyle = fillStyle;

  return {
    measure: (text: string) => ctx.measureText(text),
    draw: (text: string, x: number, y: number, maxWidth?: number) =>
      ctx.fillText(text, x, y, maxWidth),
  };
}
