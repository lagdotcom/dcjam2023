export default function random(max: number, min = 0) {
  const diff = max - min;
  return min + Math.floor(Math.random() * diff);
}
