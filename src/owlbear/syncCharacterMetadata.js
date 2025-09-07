import OBR from "@owlbear-rodeo/sdk";

const ID = "com.anidra.addto";

function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}
function deepMerge(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (isObject(source[key])) {
      output[key] = key in target ? deepMerge(target[key], source[key]) : source[key];
    } else {
      output[key] = source[key];
    }
  }
  return output;
}
export function updateCharacterSheet(sheet, updateObj) {
  return deepMerge(sheet, updateObj);
}
export async function updateMetada(CharID, sheet) {
  await OBR.scene.items.updateItems([CharID], (items) => {
    return items.map(item => {
      item.metadata[`${ID}/metadata`] = {
        info: { Stats: JSON.parse(JSON.stringify(sheet)) }
      };
      return item;
    });
  });
}