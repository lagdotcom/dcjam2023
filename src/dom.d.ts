interface HTMLCanvasElement {
  width: import("./types/flavours").Pixels;
  height: import("./types/flavours").Pixels;
}

interface CanvasRenderingContext2D {
  fillStyle: import("./types/flavours").Colour | CanvasGradient | CanvasPattern;
  globalAlpha: import("./types/flavours").Ratio;

  fillRect(
    x: import("./types/flavours").Pixels,
    y: import("./types/flavours").Pixels,
    width: import("./types/flavours").Pixels,
    height: import("./types/flavours").Pixels,
  ): void;
  fillText(
    text: string,
    x: import("./types/flavours").Pixels,
    y: import("./types/flavours").Pixels,
    maxWidth?: import("./types/flavours").Pixels,
  ): void;
}

interface KeyboardEvent {
  code: import("./types/flavours").KeyCode;
}
