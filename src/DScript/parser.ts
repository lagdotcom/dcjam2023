import { Grammar, Parser } from "nearley";
import { NParseError, NParser } from "./internals";

import { Program } from "./ast";
import { Token } from "./Lexer";
import grammar from "./grammar";
import isDefined from "../tools/isDefined";
import uniq from "../tools/uniq";

function makeEOFToken(p: NParser, src: string): Token {
  return {
    col: p.lexerState?.col ?? p.lexer.col,
    line: p.lexerState?.line ?? p.lexer.line,
    offset: src.length,
    type: "EOF",
    value: "",
  };
}

class ParseError extends Error {
  constructor(public p: NParser, public token: Token, public src: string) {
    super("Syntax error");
    console.log("ParseError", { p, token, src });

    const col = p.table[p.current];
    // TODO improve this?
    const expected = col.states
      .map((s) => {
        const ns = s.rule.symbols[s.dot];
        if (typeof ns === "object") {
          if (ns.literal) return `"${ns.literal}"`;
          if (ns.type) return ns.type;
        }
        if (typeof ns === "string") return `(${ns})`;
      })
      .filter(isDefined);
    const message =
      token.type === "UNCLOSED_STRING"
        ? "Unclosed string"
        : `Got ${token.type} token${
            token.value ? ` "${token.value}"` : ""
          }, expected one of: ${uniq(expected).sort().join(", ")}`;

    this.message = [p.lexer.formatError(token), message].join("\n");
  }
}

export default function parse(src: string): Program {
  const p = new Parser(Grammar.fromCompiled(grammar)) as NParser;
  try {
    p.feed(src.trim());
  } catch (error: unknown) {
    throw new ParseError(p, (error as NParseError).token, src);
  }

  const result = p.results;

  if (result.length === 0) throw new ParseError(p, makeEOFToken(p, src), src);
  if (result.length > 1) {
    for (let i = 0; i < result.length; i++) {
      console.log(`--- PARSE #${i}`);
      console.dir(result[0], { depth: Infinity });
    }
    throw new Error("Ambiguous parse.");
  }
  return result[0] as Program;
}
