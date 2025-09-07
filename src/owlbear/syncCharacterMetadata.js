import OBR from "@owlbear-rodeo/sdk";

const ID = "com.anidra.addto";


export async function updateCharacterSheet(sheet, path, newValue) {
  if (path.length === 0) return sheet;
  const [key, ...restPath] = path;
  return {
    ...sheet,
    [key]: restPath.length === 0
      ? newValue
      : updateCharacterSheet(sheet[key], restPath, newValue),
  };
}