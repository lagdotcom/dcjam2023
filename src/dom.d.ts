interface HTMLCanvasElement {
  width: import("./types/flavours").Pixels;
  height: import("./types/flavours").Pixels;
}

interface CanvasRenderingContext2D {
  fillStyle: import("./types/flavours").Colour | CanvasGradient | CanvasPattern;
  globalAlpha: import("./types/flavours").Ratio;

  drawImage(
    image: CanvasImageSource,
    dx: import("./types/flavours").Pixels,
    dy: import("./types/flavours").Pixels,
  ): void;
  drawImage(
    image: CanvasImageSource,
    dx: import("./types/flavours").Pixels,
    dy: import("./types/flavours").Pixels,
    dw: import("./types/flavours").Pixels,
    dh: import("./types/flavours").Pixels,
  ): void;
  drawImage(
    image: CanvasImageSource,
    sx: import("./types/flavours").Pixels,
    sy: import("./types/flavours").Pixels,
    sw: import("./types/flavours").Pixels,
    sh: import("./types/flavours").Pixels,
    dx: import("./types/flavours").Pixels,
    dy: import("./types/flavours").Pixels,
    dw: import("./types/flavours").Pixels,
    dh: import("./types/flavours").Pixels,
  ): void;

  getImageData(
    sx: import("./types/flavours").Pixels,
    sy: import("./types/flavours").Pixels,
    sw: import("./types/flavours").Pixels,
    sh: import("./types/flavours").Pixels,
    settings?: ImageDataSettings,
  ): ImageData;

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

  putImageData(
    imagedata: ImageData,
    dx: import("./types/flavours").Pixels,
    dy: import("./types/flavours").Pixels,
  ): void;
  putImageData(
    imagedata: ImageData,
    dx: import("./types/flavours").Pixels,
    dy: import("./types/flavours").Pixels,
    dirtyX: import("./types/flavours").Pixels,
    dirtyY: import("./types/flavours").Pixels,
    dirtyWidth: import("./types/flavours").Pixels,
    dirtyHeight: import("./types/flavours").Pixels,
  ): void;
}

interface KeyboardEvent {
  code: import("./types/flavours").KeyCode;
}
