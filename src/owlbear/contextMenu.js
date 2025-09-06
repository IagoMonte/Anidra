import OBR from "@owlbear-rodeo/sdk";
const ID = "com.tutorial.initiative-tracker";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        label: "Adicionar a Anidra",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const initiative = window.prompt("Enter the initiative value");
      OBR.scene.items.updateItems(context.items, (items) => {
        for (let item of items) {
          item.metadata[`${ID}/metadata`] = {
            initiative,
          };
        }
      });
    },
  });
}