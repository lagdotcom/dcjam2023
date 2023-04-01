export default function textWrap(
  ctx: CanvasRenderingContext2D,
  source: string,
  width: number
) {
  const measurement = ctx.measureText(source);
  if (measurement.width < width) return { lines: [source], measurement };

  const words = source.split(" ");
  const lines: string[] = [];
  let constructed = "";
  for (const w of words) {
    if (!constructed) {
      constructed += w;
      continue;
    }

    const temp = constructed + " " + w;
    const size = ctx.measureText(temp);

    if (size.width > width) {
      lines.push(constructed);
      constructed = w;
    } else constructed += " " + w;
  }

  if (constructed) lines.push(constructed);

  return { lines, measurement: ctx.measureText(source) };
}
