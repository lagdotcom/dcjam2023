import { Lexer as NearleyLexer } from "nearley";
import leftPad from "../tools/leftPad";

type TokenType =
  | "EOF"
  | "INVALID"
  | "UNCLOSED_STRING"
  | "keyword"
  | "sqstring"
  | "dqstring"
  | "comment"
  | "punctuation"
  | "number"
  | "ws"
  | "word";

export type State = { line: number; col: number };
export type Token = {
  line: number;
  col: number;
  offset: number;
  type: TokenType;
  value: string;
};

const wsPattern = /[ \r\n\t]/;
const isWhiteSpace = (ch: string) => wsPattern.test(ch);

const nlPattern = /[\r\n]/;
const isNewline = (ch: string) => nlPattern.test(ch);

const numberPattern = /^[0-9]+$/;
const isNumber = (w: string) => numberPattern.test(w);

const wordPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const isWord = (w: string) => wordPattern.test(w);

const keywords = [
  "and",
  "any",
  "bool",
  "else",
  "end",
  "false",
  "function",
  "if",
  "not",
  "number",
  "or",
  "return",
  "string",
  "true",
  "xor",
];
const isKeyword = (w: string) => keywords.includes(w);

const punctuation = new Set([
  "=",
  "+=",
  "-=",
  "*=",
  "/=",
  "^=",
  "(",
  ")",
  ":",
  ",",
  ">",
  ">=",
  "<",
  "<=",
  "==",
  "!", // this is only for !=
  "!=",
  "+",
  "-",
  "*",
  "/",
  "^",
]);
const isPunctuation = (w: string) => punctuation.has(w);

const commentChar = ";";

export default class Lexer implements NearleyLexer {
  buffer!: string;
  consumed!: string;
  index!: number;
  line!: number;
  lastLineBreak!: number;

  constructor() {
    this.reset("");
  }

  get col() {
    return this.index - this.lastLineBreak + 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  has(_type: string) {
    return true;
  }

  reset(data: string, state?: State | undefined): void {
    this.buffer = data;
    this.index = 0;
    this.line = state ? state.line : 1;
    this.lastLineBreak = state ? -state.col : 0;
  }

  next(): Token | undefined {
    const { line, col, index } = this;
    const [type, value] = this.getNextToken();

    if (type === "EOF") return;
    return { line, col, offset: index, type, value };
  }

  save(): State {
    const { line, col } = this;
    return { line, col: col - 1 };
  }

  formatError(token: Token, message = "Syntax error"): string {
    const lines = this.buffer.replace(/\r/g, "").split("\n");

    const min = Math.max(0, token.line - 3);
    const max = Math.min(token.line + 2, lines.length - 1);
    const lineNoSize = max.toString().length;
    const context: string[] = [];
    for (let i = min; i < max; i++) {
      const line = lines[i];
      const showLineNo = i + 1;
      const raw = showLineNo.toString();
      const lineNo = leftPad(raw, lineNoSize - raw.length);
      context.push(`${lineNo} ${line}`);
      if (showLineNo === token.line)
        context.push(leftPad("^", token.col + lineNoSize + 1, "-"));
    }

    return [
      `${message} at line ${token.line} col ${token.col}`,
      ...context,
    ].join("\n");
  }

  private isEOF() {
    return this.index >= this.buffer.length;
  }

  private peek() {
    return this.buffer[this.index];
  }

  private consume() {
    const ch = this.peek();
    this.consumed += ch;
    this.index++;

    if (ch === "\n") {
      this.line++;
      this.lastLineBreak = this.index;
    }

    return ch;
  }

  private repeater(isValid: (w: string) => boolean) {
    this.consume();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.isEOF()) break;
      const maybe = this.consumed + this.peek();
      if (!isValid(maybe)) break;
      this.consume();
    }

    return this.consumed;
  }

  private getNextToken(): [type: TokenType, value: string] {
    this.consumed = "";
    if (this.isEOF()) return ["EOF", ""];

    const ch = this.peek();
    if (isWhiteSpace(ch)) {
      while (isWhiteSpace(this.peek())) this.consume();
      return ["ws", this.consumed];
    }

    if (isNumber(ch)) {
      const number = this.repeater(isNumber);
      return ["number", number];
    }

    if (isWord(ch)) {
      const word = this.repeater(isWord);
      if (isKeyword(word)) return ["keyword", word];
      return ["word", word];
    }

    if (isPunctuation(ch)) {
      const punctuation = this.repeater(isPunctuation);
      return ["punctuation", punctuation];
    }

    if (ch === '"' || ch === "'") {
      this.consume();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (this.isEOF()) return ["UNCLOSED_STRING", ch];

        const next = this.consume();
        if (next === ch)
          return [ch === "'" ? "sqstring" : "dqstring", this.consumed];
      }
    }

    if (ch === commentChar) {
      this.consume();
      while (!this.isEOF() && !isNewline(this.peek())) this.consume();
      return ["comment", this.consumed];
    }

    return ["INVALID", ch];
  }
}
