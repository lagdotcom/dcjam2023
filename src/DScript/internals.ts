import { Grammar, Parser as PublicParser } from "nearley";
import Lexer, { State, Token } from "./Lexer";

export type NParseError = Error & { offset: number; token: Token };

export type NParser = Omit<PublicParser, "lexer" | "lexerState"> & {
  lexer: Lexer;
  lexerState?: State;
  table: Record<number, NColumn>;
};

export interface NColumn {
  completed: Record<string, NState[]>;
  grammar: Grammar;
  index: number;
  states: NState[];
  wants: Record<string, NState[]>;
}

export interface NState {
  dot: number;
  isComplete: boolean;
  reference: number;
  rule: NRule;
  wantedBy: NState[];
}

export interface NRule {
  id: number;
  name: string;
  symbols: NSymbol[];
}

export type NSymbol =
  | string
  | { literal?: string; type?: string; test?: (token: Token) => boolean };
