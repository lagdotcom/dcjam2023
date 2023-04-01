export default function textWrap(
  source: string,
  width: number,
  measure: (str: string) => TextMetrics
) {
  const measurement = measure(source);
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
    const size = measure(temp);

    if (size.width > width) {
      lines.push(constructed);
      constructed = w;
    } else constructed += " " + w;
  }

  if (constructed) lines.push(constructed);

  return { lines, measurement: measure(source) };
}
