import OBR from "@owlbear-rodeo/sdk";
const ID = "com.anidra.addto"

export function setupCounter() {
  OBR.notification.show(`Anidra pronto!!`);
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/img/add.svg",
        label: "Adicionar ao AnidraCtl",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove.svg",
        label: "Remover do AnidraCtl",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const addToAnidra = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (addToAnidra) {
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = {};
          }
        });
      } else {
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            delete item.metadata[`${ID}/metadata`];
          }
        });
      }
    },
  });
}
