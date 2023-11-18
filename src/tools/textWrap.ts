function splitWords(s: string) {
  const words: string[] = [];
  let current = "";

  for (const c of s) {
    if (c === " " || c === "\n") {
      words.push(current);
      if (c === "\n") words.push("\n");
      current = "";
      continue;
    }

    current += c;
  }

  if (current) words.push(current);
  return words;
}

export default function textWrap(
  source: string,
  width: number,
  measure: (str: string) => TextMetrics,
) {
  const measurement = measure(source);
  if (measurement.width < width)
    return { lines: source.split("\n"), measurement };

  const words = splitWords(source);
  const lines: string[] = [];
  let constructed = "";
  for (const w of words) {
    if (w === "\n") {
      lines.push(constructed);
      constructed = "";
      continue;
    }

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
