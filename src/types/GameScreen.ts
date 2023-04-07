export interface GameScreen {
  doNotClear?: boolean;
  onKey(e: KeyboardEvent): void;
  render(): void;
}
