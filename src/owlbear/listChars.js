import OBR from "@owlbear-rodeo/sdk";

const ID = "com.anidra.addto";

/**
 * Retorna todos os itens CHARACTERS que foram adicionados ao AnidraCtl
 * @returns {Promise<Array>} Lista de objetos com { id, name, visible, count, metadata }
 */
export async function getAnidraCharacters() {
  // Pega todos os itens da cena
  const allItems = await OBR.scene.items.getAll();

  // Filtra só os CHARACTERS que têm a metadata do AnidraCtl
  const anidraItems = allItems.filter(
    (item) =>
      item.layer === "CHARACTER" &&
      item.metadata &&
      item.metadata[`${ID}/metadata`] !== undefined
  );

  // Mapeia para retornar só os dados necessários
  return anidraItems.map((item) => ({
    id: item.id,
    name: item.name,
    visible: item.visible,
    count: item.count ?? "", // se tiver contador
    metadata: item.metadata[`${ID}/metadata`] || {},
    active: item.active ?? false,
  }));
}