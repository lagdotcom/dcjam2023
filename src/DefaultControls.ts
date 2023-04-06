import GameInput from "./types/GameInput";

const DefaultControls: [string, GameInput[]][] = [
  ["ArrowUp", ["Forward", "MenuUp"]],
  ["KeyW", ["Forward", "MenuUp"]],

  ["ArrowRight", ["TurnRight"]],
  ["KeyE", ["TurnRight"]],

  ["ArrowDown", ["Back", "MenuDown"]],
  ["KeyS", ["Back", "MenuDown"]],

  ["ArrowLeft", ["TurnLeft"]],
  ["KeyQ", ["TurnLeft"]],

  ["Shift+ArrowRight", ["SlideRight"]],
  ["KeyD", ["SlideRight"]],

  ["Shift+ArrowLeft", ["SlideLeft"]],
  ["KeyA", ["SlideLeft"]],

  ["Ctrl+ArrowRight", ["RotateRight"]],
  ["Ctrl+KeyD", ["RotateRight"]],

  ["Ctrl+ArrowLeft", ["RotateLeft"]],
  ["Ctrl+KeyA", ["RotateLeft"]],

  ["Alt+ArrowRight", ["SwapRight"]],
  ["Alt+KeyD", ["SwapRight"]],

  ["Alt+ArrowDown", ["SwapBehind"]],
  ["Alt+KeyS", ["SwapBehind"]],

  ["Alt+ArrowLeft", ["SwapLeft"]],
  ["Alt+KeyA", ["SwapLeft"]],

  ["Space", ["ToggleLog"]],
  ["Enter", ["Interact", "MenuChoose"]],
  ["Return", ["Interact", "MenuChoose"]],
  ["Escape", ["Cancel"]],
];
export default DefaultControls;
