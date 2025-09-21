import OBR from "@owlbear-rodeo/sdk";
const ID = "com.anidra.addto"

const initcharacterSheet = {
  dons: null, // pode virar array depois

  conditions: null, // pode virar array depois
  stats: {
    mainAttributes: {
      Vida: "1 / 1",
      Estamina: "1 / 1",
      Mana: "1 / 1",
      Movimento: "1 / 1",
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
          { name: "combate", checks: 1, checked: [false] },
          { name: "campanha", checks: 1, checked: [false] },
        ],
        description: "Descricao da Habilidade",
        completed: true,
      },
    ],

    unmasteredSkills: [
      {
        title: "Habilidade não dominada",
        tags: [
          { name: "10", checks: 1, checked: [false] },
          { name: "8", checks: 2, checked: [false, false] },
          { name: "6", checks: 4, checked: [false, false, false, false] },
          { name: "4", checks: 6, checked: [false, false, false, false, false, false] },
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
            console.log(item.metadata[`${ID}/metadata`])
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
  OBR.broadcast.onMessage('Roll_Result', async (msg) => {
    let charid = msg.data.playerId
    const charData = await OBR.scene.items.getItems([charid])
    let res = `${msg.data.testLabel} de ${charData[0].name}: [${msg.data.rolls.join(",")}] + ${msg.data.modi} + ${msg.data.bonus} => ${msg.data.total}`
    OBR.notification.show(res)
  });

}
