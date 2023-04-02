import GameInput from "./types/GameInput";

const DefaultControls: [string, GameInput[]][] = [
  ["ArrowUp", ["Forward"]],
  ["ArrowDown", ["Back"]],
  ["ArrowLeft", ["TurnLeft"]],
  ["ArrowRight", ["TurnRight"]],
  ["Shift+ArrowLeft", ["SlideLeft"]],
  ["Shift+ArrowRight", ["SlideRight"]],

  ["KeyQ", ["TurnLeft"]],
  ["KeyE", ["TurnRight"]],
  ["KeyW", ["Forward"]],
  ["KeyD", ["SlideRight"]],
  ["KeyS", ["Back"]],
  ["KeyA", ["SlideLeft"]],

  ["Space", ["ToggleLog"]],
  ["Enter", ["Interact", "MenuChoose"]],
  ["Return", ["Interact", "MenuChoose"]],
];
export default DefaultControls;
