import mapDScript from "../res/map.dscript";

const Resources: Record<string, string> = {
  "map.dscript": mapDScript,
};

export function getResourceURL(id: string) {
  const value = Resources[id];
  if (!value) throw new Error(`Invalid resource ID: ${id}`);
  return value;
}
