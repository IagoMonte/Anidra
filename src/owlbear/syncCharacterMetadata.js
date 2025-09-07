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
    console.log("syncdata")
    console.log(sheet)
    await OBR.scene.items.updateItems([CharID], (items) => {
    for (let item of items) {
            item.metadata[`${ID}/metadata`] = sheet

      // Remove qualquer proxy do Vue e garante serialização
    //   item.metadata[`${ID}/metadata`] = {
    //     info: { Stats: JSON.parse(JSON.stringify(sheet)) }
    //   };
    }
  });
}
export async function getMetadaById(CharID) {
    const item = await OBR.scene.items.getItems([CharID])
    return item[0].metadata[`${ID}/metadata`]
}