export default function leftPad(s: string, n: number, char = " ") {
  return Array(n).join(char) + s;
}
