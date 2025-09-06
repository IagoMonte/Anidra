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
        <div v-for="(attr, i) in mainAttributes" :key="i"
          class="border border-gray-600 rounded-md px-3 py-1 flex justify-between items-center text-base">
          <span>{{ attr.label }}</span>
          <span v-if="!editingAttributes">{{ attr.value }}</span>
          <input v-else v-model="attr.tempValue" class="w-24 text-white text-center rounded px-1" />
        </div>
      </div>

      <!-- Secundários -->
      <div class="grid grid-cols-5 gap-3 mb-4">
        <article v-for="(stat, i) in secondaryStats" :key="i"
          class="border border-gray-600 rounded-md px-2 pt-1 pb-2 flex flex-col items-center text-center text-xs relative">
          <span class="mb-1">{{ stat.label }}</span>
          <span v-if="!editingAttributes" class="text-2xl font-light">{{ stat.value }}</span>
          <input v-else v-model="stat.tempValue" type="number" class="w-12 text-white text-center rounded px-1" />
          <div v-for="corner in corners" :key="corner"
            :class="`absolute ${corner} w-4 h-4 border-gray-600 decorative-corner`"></div>
        </article>
      </div>
    </section>
    <!-- Seções de texto -->
    <section class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <p class="text-base font-normal">Dom</p>
        <button @click="editingDom = !editingDom" class="text-xs text-yellow-400 hover:text-yellow-300">
          {{ editingDom ? "Concluir" : "Editar" }}
        </button>
      </div>
      <hr class="border-gray-700 mb-2" />

      <!-- Se não estiver editando -->
      <p v-if="!editingDom" class="text-gray-300 text-sm">
        {{ selectedDom || "Nenhum dom selecionado" }}
      </p>

      <!-- Se estiver editando -->
      <select v-else v-model="selectedDom"
        class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600">
        <option disabled value="">Selecione um Dom</option>
        <option v-for="(dom, i) in dons" :key="i" :value="dom">
          {{ dom }}
        </option>
      </select>
    </section>

    <section class="mb-4">
      <div class="flex items-center justify-between mb-1">
        <p class="text-base font-normal">Condição</p>
        <button @click="editingCondition = !editingCondition" class="text-xs text-yellow-400 hover:text-yellow-300">
          {{ editingCondition ? "Concluir" : "Editar" }}
        </button>
      </div>
      <hr class="border-gray-700 mb-2" />

      <!-- Se não estiver editando -->
      <p v-if="!editingCondition" class="text-gray-300 text-sm">
        {{ selectedCondition || "Nenhuma condição selecionada" }}
      </p>

      <!-- Se estiver editando -->
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
        <div v-for="(prof, i) in proficiencies" :key="i"
          class="border border-gray-600 rounded-md px-3 py-1 flex justify-between items-center text-base">
          <span>{{ prof.label }}</span>

          <!-- checkbox -->
          <input v-if="prof.type === 'checkbox'" type="checkbox" v-model="prof.value" :disabled="!editingProficiencies"
            class="w-5 h-5 border border-gray-600 bg-transparent checked:bg-white checked:border-white" />

          <!-- numérico -->
          <span v-else-if="!editingProficiencies">{{ prof.value }}</span>
          <input v-else v-model="prof.tempValue" type="number" class="w-14 text-white text-center rounded px-1" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue"
const selectedDom = ref("")
const selectedCondition = ref("")

const editingDom = ref(false)
const editingCondition = ref(false)

const editingAttributes = ref(false)
const editingProficiencies = ref(false)

const dons = ["Talento", "Atenção", "Força", "Sorte", "Esforço", "Carisma"]

const conditions = ["Nocaute", "Alucinação", "Cansaço", "Sangrando",
  "Agonia", "Paralizado", "Medo", "Histeria", "Raiva", "Tristeza", "Morrendo"]

const mainAttributes = reactive([
  { label: "Vida", value: "5 / 10" },
  { label: "Estamina", value: "10 / 20" },
  { label: "Mana", value: "4 / 4" },
  { label: "Movimento", value: "9 / 9" },
])

const secondaryStats = reactive([
  { label: "Defesa", value: 5 },
  { label: "Carisma", value: 15 },
  { label: "Força", value: 2 },
  { label: "Aura", value: 4 },
  { label: "Sorte", value: 6 },
])

const corners = [
  "top-0 left-0 border-t border-l rounded-tl-md",
  "top-0 right-0 border-t border-r rounded-tr-md",
  "bottom-0 left-0 border-b border-l rounded-bl-md",
  "bottom-0 right-0 border-b border-r rounded-br-md",
]

const proficiencies = reactive([
  { label: "Percepção", value: 3, type: "number" },
  { label: "Persuasão", value: 0, type: "number" },
  { label: "Furtividade", value: 0, type: "number" },
  { label: "Furtividade De Combate", value: 0, type: "number" },
  { label: "Acrobacia", value: 0, type: "number" },
  { label: "Acrobacia De Combate", value: 0, type: "number" },
  { label: "Ataque", value: 0, type: "number" },
  { label: "Defesa", value: 0, type: "number" },
  { label: "Persistência", value: 0, type: "number" },
  { label: "Precisão", value: 0, type: "number" },
  { label: "Conserto", value: false, type: "checkbox" },
  { label: "Linguagens", value: false, type: "checkbox" },
])

function startEdit(section) {
  if (section === "attributes") {
    editingAttributes.value = true
    mainAttributes.forEach((a) => (a.tempValue = a.value))
    secondaryStats.forEach((a) => (a.tempValue = a.value))
  }
  if (section === "proficiencies") {
    editingProficiencies.value = true
    proficiencies.forEach((p) => (p.tempValue = p.value))
  }
}

function confirmEdit(section) {
  if (section === "attributes") {
    mainAttributes.forEach((a) => (a.value = a.tempValue))
    secondaryStats.forEach((a) => (a.value = a.tempValue))
    editingAttributes.value = false
  }
  if (section === "proficiencies") {
    proficiencies.forEach((p) => {
      if (p.type === "number") p.value = p.tempValue
    })
    editingProficiencies.value = false
  }
}

function cancelEdit(section) {
  if (section === "attributes") {
    editingAttributes.value = false
  }
  if (section === "proficiencies") {
    editingProficiencies.value = false
  }
}
</script>
