<template>
  <main class="bg-[#121212] flex-grow px-4 pt-4 pb-20 text-white min-h-screen p-4">
    <!-- Atributos -->
    <section class="mb-6 border border-gray-600 rounded-lg p-3"
      :class="editingAttributes ? 'ring-2 ring-yellow-500' : ''">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">Atributos</h2>
        <div class="flex gap-2">
          <button v-if="!editingAttributes" @click="startEdit('attributes')"
            class="text-sm text-gray-400 hover:text-white">
            Editar
          </button>
          <template v-else>
            <button @click="confirmEdit('attributes')" class="text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar
            </button>
            <button @click="cancelEdit('attributes')" class="text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar
            </button>
          </template>
        </div>
      </div>

      <!-- Principais -->
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div v-for="(attr, i) in mainAttributesReactive" :key="i"
          class="border border-gray-600 rounded-md px-3 py-1 flex justify-between items-center text-base">
          <span>{{ attr.label }}</span>
          <span v-if="!editingAttributes">{{ attr.value }}</span>
          <input v-else v-model="attr.tempValue" class="w-24 text-white text-center rounded px-1" />
        </div>
      </div>

      <!-- Secundários -->
      <div class="grid grid-cols-5 gap-3 mb-4">
        <article v-for="(stat, i) in secondaryStatsReactive" :key="i"
          class="border border-gray-600 rounded-md px-2 pt-1 pb-2 flex flex-col items-center text-center text-xs relative">
          <span class="mb-1">{{ stat.label }}</span>
          <span v-if="!editingAttributes" class="text-2xl font-light">{{ stat.value }}</span>
          <input v-else v-model="stat.tempValue" type="number" class="w-12 text-white text-center rounded px-1" />
          <div v-for="corner in corners" :key="corner"
            :class="`absolute ${corner} w-4 h-4 border-gray-600 decorative-corner`"></div>
        </article>
      </div>
    </section>

    <!-- Dons -->
    <section class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <p class="text-base font-normal">Dom</p>
        <button @click="editingDom = !editingDom" class="text-xs text-yellow-400 hover:text-yellow-300">
          {{ editingDom ? "Concluir" : "Editar" }}
        </button>
      </div>
      <hr class="border-gray-700 mb-2" />

      <p v-if="!editingDom" class="text-gray-300 text-sm">
        {{ selectedDom || "Nenhum dom selecionado" }}
      </p>

      <select v-else v-model="selectedDom"
        class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600">
        <option disabled value="">Selecione um Dom</option>
        <option v-for="(dom, i) in dons" :key="i" :value="dom">
          {{ dom }}
        </option>
      </select>
    </section>

    <!-- Condições -->
    <section class="mb-4">
      <div class="flex items-center justify-between mb-1">
        <p class="text-base font-normal">Condição</p>
        <button @click="editingCondition = !editingCondition" class="text-xs text-yellow-400 hover:text-yellow-300">
          {{ editingCondition ? "Concluir" : "Editar" }}
        </button>
      </div>
      <hr class="border-gray-700 mb-2" />

      <p v-if="!editingCondition" class="text-gray-300 text-sm">
        {{ selectedCondition || "Nenhuma condição selecionada" }}
      </p>

      <select v-else v-model="selectedCondition"
        class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600">
        <option disabled value="">Selecione uma Condição</option>
        <option v-for="(cond, i) in conditions" :key="i" :value="cond">
          {{ cond }}
        </option>
      </select>
    </section>

    <!-- Proficiencias -->
    <section class="mb-4 border border-gray-600 rounded-lg p-3"
      :class="editingProficiencies ? 'ring-2 ring-blue-500' : ''">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">Proficências</h2>
        <div class="flex gap-2">
          <button v-if="!editingProficiencies" @click="startEdit('proficiencies')"
            class="text-sm text-gray-400 hover:text-white">
            Editar
          </button>
          <template v-else>
            <button @click="confirmEdit('proficiencies')" class="text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar
            </button>
            <button @click="cancelEdit('proficiencies')" class="text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar
            </button>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="(prof, i) in proficienciesReactive" :key="i"
          class="border border-gray-600 rounded-md px-3 py-1 flex justify-between items-center text-base">
          <span>{{ prof.label }}</span>

          <input v-if="prof.type === 'checkbox'" type="checkbox" v-model="prof.value" :disabled="!editingProficiencies"
            class="w-5 h-5 border border-gray-600 bg-transparent checked:bg-white checked:border-white" />

          <span v-else-if="!editingProficiencies">{{ prof.value }}</span>
          <input v-else v-model="prof.tempValue" type="number" class="w-14 text-white text-center rounded px-1" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import OBR from "@owlbear-rodeo/sdk";

const ID = "com.anidra.addto";

// Props esperam receber o objeto completo de selectedChar.data.info.Stats
const props = defineProps({
  charData: { type: Object, required: true }, // aqui passa selectedChar.data.info.Stats
  charId: { type: String, required: true } // id do item no Owlbear
})

const editingDom = ref(false);
const editingCondition = ref(false);
const editingAttributes = ref(false);
const editingProficiencies = ref(false);

// Reativos que serão usados na UI
const mainAttributesReactive = reactive(
  Object.entries(props.charData.stats.mainAttributes || {}).map(([label, value]) => ({ label, value }))
);

const secondaryStatsReactive = reactive(
  Object.entries(props.charData.stats.secondaryStats || {}).map(([label, value]) => ({ label, value }))
);

const proficienciesReactive = reactive(
  Object.entries(props.charData.stats.proficiencies || {}).map(([label, value]) => ({
    label,
    value,
    tempValue: value,
    type: typeof value === "boolean" ? "checkbox" : "number"
  }))
);

const dons = props.charData.dons || [];
const conditions = props.charData.conditions || [];

const selectedDom = ref(dons?.[0] || "");
const selectedCondition = ref(conditions?.[0] || "");

const corners = [
  "top-0 left-0 border-t border-l rounded-tl-md",
  "top-0 right-0 border-t border-r rounded-tr-md",
  "bottom-0 left-0 border-b border-l rounded-bl-md",
  "bottom-0 right-0 border-b border-r rounded-br-md",
];

function buildCharacterSheet({
  mainAttributesReactive,
  secondaryStatsReactive,
  proficienciesReactive,
  dons = null,
  conditions = null,
  skills = null,
  inventory = null,
  notes = null
}) {
  return {
    dons: dons ?? null,
    conditions: conditions ?? null,
    stats: {
      mainAttributes: Object.fromEntries(
        mainAttributesReactive.map(a => [a.label, a.value])
      ),
      secondaryStats: Object.fromEntries(
        secondaryStatsReactive.map(a => [a.label, a.value])
      ),
      proficiencies: Object.fromEntries(
        proficienciesReactive.map(p => [p.label, p.value])
      ),
    },
    skills: skills ? JSON.parse(JSON.stringify(skills)) : {
      masteredSkills: [
        {
          title: "Habilidade",
          tags: [
            { name: "combate", checks: 1 },
            { name: "campanha", checks: 1 },
          ],
          description: "Descricao da Habilidade",
          completed: true,
        }
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
        }
      ]
    },
    inventory: inventory ? JSON.parse(JSON.stringify(inventory)) : [
      { name: "Item", quantity: 1, description: "Descricao" }
    ],
    notes: notes ? JSON.parse(JSON.stringify(notes)) : [
      { title: "Primeira Nota", content: "Esta é a primeira nota.\nEla pode ter várias linhas." }
    ]
  }
}


// Funções de edição
function startEdit(section) {
  if (section === "attributes") {
    editingAttributes.value = true;
    mainAttributesReactive.forEach((a) => (a.tempValue = a.value));
    secondaryStatsReactive.forEach((a) => (a.tempValue = a.value));
  }
  if (section === "proficiencies") {
    editingProficiencies.value = true;
    proficienciesReactive.forEach((p) => (p.tempValue = p.value));
  }
}

function confirmEdit(section) {
  if (section === "attributes") {
    mainAttributesReactive.forEach((a) => (a.value = a.tempValue));
    secondaryStatsReactive.forEach((a) => (a.value = a.tempValue));
    editingAttributes.value = false;
  }
  if (section === "proficiencies") {
    proficienciesReactive.forEach((p) => {
      if (p.type === "number") p.value = p.tempValue;
    });
    editingProficiencies.value = false;
  }


  let mainAttributesPlain = Object.fromEntries(
    mainAttributesReactive.map(a => [a.label, a.value])
  )

  let secondaryStatsPlain = Object.fromEntries(
    secondaryStatsReactive.map(a => [a.label, a.value])
  )

  let proficienciesPlain = Object.fromEntries(
    proficienciesReactive.map(p => [p.label, p.value])
  )
  // Atualiza o metadata no Owlbear Rodeo
  const newSheet = buildCharacterSheet({
    mainAttributesReactive,
    secondaryStatsReactive,
    proficienciesReactive,
    dons: props.charData.dons,
    conditions: props.charData.conditions,
    skills: props.charData.skills,
    inventory: props.charData.inventory,
    notes: props.charData.notes
  });

  OBR.scene.items.updateItems([props.charId], (items) => {
    for (let item of items) {
      item.metadata[`${ID}/metadata`] = {info: { Stats: newSheet }};
    }
  });
}

function cancelEdit(section) {
  if (section === "attributes") editingAttributes.value = false;
  if (section === "proficiencies") editingProficiencies.value = false;
}

// Atualiza os reativos caso charData mude
watch(() => props.charData, (newVal) => {
  Object.assign(mainAttributesReactive, Object.entries(newVal.stats.mainAttributes || {}).map(([label, value]) => ({ label, value })));
  Object.assign(secondaryStatsReactive, Object.entries(newVal.stats.secondaryStats || {}).map(([label, value]) => ({ label, value })));
  Object.assign(proficienciesReactive, Object.entries(newVal.stats.proficiencies || {}).map(([label, value]) => ({ label, value, tempValue: value, type: typeof value === "boolean" ? "checkbox" : "number" })));
  dons.splice(0, dons.length, ...(newVal.dons || []));
  conditions.splice(0, conditions.length, ...(newVal.conditions || []));
  selectedDom.value = dons?.[0] || "";
  selectedCondition.value = conditions?.[0] || "";
}, { deep: true });
</script>