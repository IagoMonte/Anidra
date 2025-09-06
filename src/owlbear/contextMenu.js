import OBR from "@owlbear-rodeo/sdk";
const ID = "com.anidra.addto"

export function setupCounter() {
  OBR.notification.show(`Anidra pronto!!`);
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/src/assets/img/add.svg",
        label: "Adicionar ao AnidraCtl",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick() {
    },
  })
}