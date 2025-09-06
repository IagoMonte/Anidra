import OBR from "@owlbear-rodeo/sdk";
const ID = "com.anidra.addto"

const initcharacterSheet = {
  dons: null, // pode virar array depois

  conditions: null, // pode virar array depois
  stats: {
    mainAttributes: {
      Vida: "5 / 10",
      Estamina: "10 / 20",
      Mana: "4 / 4",
      Movimento: "9 / 9",
    },

    secondaryStats: {
      Defesa: 1,
      Carisma: 1,
      Força: 1,
      Aura: 1,
      Sorte: 1,
    },

    proficiencies: {
      Percepção: 0,
      Persuasão: 0,
      Furtividade: 0,
      Furtividade_De_Combate: 0,
      Acrobacia: 0,
      Acrobacia_De_Combate: 0,
      Ataque: 0,
      Defesa: 0,
      Persistência: 0,
      Precisão: 0,
      Conserto: false,
      Linguagens: false,
    },
  },
  skills: {
    masteredSkills: [
      {
        title: "Habilidade",
        tags: [
          { name: "combate", checks: 1 },
          { name: "campanha", checks: 1 },
        ],
        description: "Descricao da Habilidade",
        completed: true,
      },
    ],

    unmasteredSkills: [
      {
        title: "Habilidade não dominada",
        tags: [
          { name: "10", checks: 1 },
          { name: "8", checks: 2 },
          { name: "6", checks: 4 },
          { name: "4", checks: 6 },
        ],
        description: "Não dominada ainda.",
        completed: false,
      },
    ],
  },

  inventory: [
    {
      name: "Item",
      quantity: 1,
      description: "Descricao",
    },
  ],

  notes: [
    {
      title: "Primeira Nota",
      content: "Esta é a primeira nota.\nEla pode ter várias linhas.",
    },
  ],
};



export function setupAnidra() {
  OBR.notification.show(`Anidra pronto!!`);
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/img/add.svg",
        label: "Adicionar ficha ao AnidraCtl",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: "/img/remove.svg",
        label: "Remover ficha do AnidraCtl",
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
            item.metadata[`${ID}/metadata`] = {
              info: {
                Stats: initcharacterSheet
              }
            };
            console.log(item.metadata)
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
