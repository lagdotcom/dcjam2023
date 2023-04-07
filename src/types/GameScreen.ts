export interface GameScreen {
  onKey(e: KeyboardEvent): void;
  render(): void;
}
