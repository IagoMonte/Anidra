import OBR from "@owlbear-rodeo/sdk";

const ID = "com.anidra.addto";

/**
 * Sincroniza e atualiza a metadata de um personagem no Owlbear Rodeo
 * @param {string} charId - ID do personagem (item)
 * @param {Object} metadataPartial - Objeto parcial de metadata a atualizar (skills, stats, inventory, etc)
 * @returns {Promise<Object>} - Metadata atualizada
 */
export async function syncCharacterMetadata(charId, metadataPartial = {}) {
  let updatedMetadata = null;

  // Atualiza o item no Owlbear
  await OBR.scene.items.updateItems([charId], (items) => {
    for (let item of items) {
      // Garante que exista a estrutura
      if (!item.metadata) item.metadata = {};
      if (!item.metadata[`${ID}/metadata`]) item.metadata[`${ID}/metadata`] = { info: {} };
      if (!item.metadata[`${ID}/metadata`].info) item.metadata[`${ID}/metadata`].info = {};

      // Atualiza apenas os campos passados
      Object.keys(metadataPartial).forEach((key) => {
        // Clona para garantir que não tenha Proxies ou referências
        item.metadata[`${ID}/metadata`].info[key] = JSON.parse(JSON.stringify(metadataPartial[key]));
      });

      updatedMetadata = item.metadata[`${ID}/metadata`].info;
    }
  });

  return updatedMetadata;
}
