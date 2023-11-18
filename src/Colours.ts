const Colours = {
  background: "rgb(32,32,32)",
  logShadow: "rgba(0,0,0,0.4)",

  majorHighlight: "rgb(96,96,64)",
  minorHighlight: "rgb(48,48,32)",
  mapVisited: "rgb(64,64,64)",

  hp: "rgb(223,113,38)",
  sp: "rgb(99,155,255)",

  itemActiveHighlighted: "rgb(255,255,192)",
  itemHighlighted: "rgb(160,160,160)",
  itemActive: "rgb(192,192,64)",
  item: "rgb(96,96,96)",
};
export default Colours;

export function getItemColour(yellow: boolean, bright: boolean) {
  return bright
    ? yellow
      ? Colours.itemActiveHighlighted
      : Colours.itemHighlighted
    : yellow
      ? Colours.itemActive
      : Colours.item;
}
