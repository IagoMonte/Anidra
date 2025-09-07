<script setup>
import { reactive, ref, toRaw } from "vue"
import SkillCard from "./SkillCard.vue"
import { getMetadaById, updateCharacterSheet, updateMetada } from "@/owlbear/syncCharacterMetadata"

const props = defineProps({
  charData: { type: Object, required: true },
  charId: { type: String, required: true }
})

// ================================
// Estado
// ================================


const masteredSkills = reactive([
  ...(props.charData.info?.Stats?.skills?.masteredSkills || [])
])
const unmasteredSkills = reactive([
  ...(props.charData.info?.Stats?.skills?.unmasteredSkills || [])
])

const editingMastered = ref(false)
const editingUnmastered = ref(false)

const tempMastered = ref([])
const tempUnmastered = ref([])

// ================================
// Funções
// ================================
function addTag(section, skillIdx, newTag = { name: "DT", checks: 1 }) {
  let targetSkill

  if (section === "mastered") {
    targetSkill = editingMastered.value ? tempMastered.value[skillIdx] : masteredSkills[skillIdx]
  } else {
    targetSkill = editingUnmastered.value ? tempUnmastered.value[skillIdx] : unmasteredSkills[skillIdx]
  }

  targetSkill.tags.push({ ...newTag })
}

function removeSkill(section, idx) {
  const target = section === "mastered"
    ? (editingMastered.value ? tempMastered.value : masteredSkills)
    : (editingUnmastered.value ? tempUnmastered.value : unmasteredSkills)
  target.splice(idx, 1)
}

function startEdit(section) {
  if (section === "mastered") {
    editingMastered.value = true
    tempMastered.value = masteredSkills.map(s => ({ ...s, tags: s.tags.map(t => ({ ...t })) }))
  }
  if (section === "unmastered") {
    editingUnmastered.value = true
    tempUnmastered.value = unmasteredSkills.map(s => ({ ...s, tags: s.tags.map(t => ({ ...t })) }))
  }
}

async function confirmEdit(section) {
  if (section === "mastered") {
    masteredSkills.splice(0, masteredSkills.length, ...tempMastered.value)
    editingMastered.value = false
  }
  if (section === "unmastered") {
    unmasteredSkills.splice(0, unmasteredSkills.length, ...tempUnmastered.value)
    editingUnmastered.value = false
  }
  const currentData = await getMetadaById(props.charId)

  currentData.info.Stats.skills.masteredSkills = JSON.parse(JSON.stringify(masteredSkills))
  currentData.info.Stats.skills.unmasteredSkills = JSON.parse(JSON.stringify(unmasteredSkills))



  try {
    await updateMetada(props.charId, currentData)
    console.log("Metadata atualizado com sucesso!")
  } catch (err) {
    console.error("Erro ao atualizar metadata:", err)
  }


  console.log(masteredSkills,unmasteredSkills)
}

function cancelEdit(section) {
  if (section === "mastered") editingMastered.value = false
  if (section === "unmastered") editingUnmastered.value = false
}

function addSkill(section) {
  const newSkill = section === "mastered"
    ? { title: "Nova Habilidade", tags: [{ name: "Combate", checks: 1 }, { name: "Campanha", checks: 1 }], description: "Descrição...", completed: true }
    : { title: "Nova Habilidade", tags: [{ name: "10", checks: 1 }], description: "Descrição...", completed: false }

  const target = section === "mastered"
    ? (editingMastered.value ? tempMastered.value : masteredSkills)
    : (editingUnmastered.value ? tempUnmastered.value : unmasteredSkills)

  target.push(newSkill)
}
</script>


<template>
  <main class="bg-[#121212] min-h-screen p-4 text-white font-sans">
    <!-- DOMINADAS -->
    <section class="mb-6 border border-gray-600 rounded-lg p-3" :class="editingMastered ? 'ring-2 ring-green-500' : ''">
      <div class="flex justify-between items-center mb-3">
        <h1 class="text-2xl font-bold">Habilidades Dominadas</h1>
        <div class="flex gap-2">
          <button v-if="!editingMastered" @click="startEdit('mastered')" class="text-sm text-gray-400 hover:text-white">
            Editar
          </button>
          <template v-else>
            <button @click="confirmEdit('mastered')" class="text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar
            </button>
            <button @click="cancelEdit('mastered')" class="text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar
            </button>
            <!-- Botão remover -->
          </template>
        </div>
      </div>

      <button @click="addSkill('mastered')" class="mb-4 px-3 py-2 bg-green-600 rounded hover:bg-green-500 text-sm">
        ➕ Adicionar dominada
      </button>

      <div class="space-y-4">
        <div v-for="(skill, idx) in (editingMastered ? tempMastered : masteredSkills)" :key="idx"
          class="border border-gray-700 p-3 rounded">
          <div v-if="!editingMastered">
            <SkillCard v-bind="skill" />
          </div>
          <div v-else class="space-y-2">
            <button @click="removeSkill('mastered', idx)"
              class="mt-2 px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">
              🗑 Remover
            </button>
            <input v-model="skill.title" class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600"
              placeholder="Título" />
            <textarea v-model="skill.description"
              class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" placeholder="Descrição" />
            <!-- Tags/Checks editáveis -->
            <div v-for="(tag, tIdx) in skill.tags" :key="tIdx" class="flex gap-2 items-center">
              <input v-model="tag.name" placeholder="DT"
                class="w-24 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />
              <input v-model.number="tag.checks" type="number" placeholder="Checks"
                class="w-24 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />

            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NÃO DOMINADAS -->
    <section class="mb-6 border border-gray-600 rounded-lg p-3"
      :class="editingUnmastered ? 'ring-2 ring-yellow-500' : ''">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-2xl font-bold">Habilidades Não Dominadas</h2>
        <div class="flex gap-2">
          <button v-if="!editingUnmastered" @click="startEdit('unmastered')"
            class="text-sm text-gray-400 hover:text-white">
            Editar
          </button>
          <template v-else>
            <button @click="confirmEdit('unmastered')" class="text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar
            </button>
            <button @click="cancelEdit('unmastered')" class="text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar
            </button>
          </template>
        </div>
      </div>

      <button @click="addSkill('unmastered')" class="mb-4 px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-500 text-sm">
        ➕ Adicionar não dominada
      </button>

      <div class="space-y-4">
        <div v-for="(skill, idx) in (editingUnmastered ? tempUnmastered : unmasteredSkills)" :key="idx"
          class="border border-gray-700 p-3 rounded">
          <div v-if="!editingUnmastered">
            <SkillCard v-bind="skill" />
          </div>
          <div v-else class="space-y-2">
            <button @click="removeSkill('unmastered', idx)"
              class="mt-2 px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">
              🗑 Remover
            </button>
            <input v-model="skill.title" class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600"
              placeholder="Título" />
            <textarea v-model="skill.description"
              class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" placeholder="Descrição" />
            <div v-for="(tag, tIdx) in skill.tags" :key="tIdx" class="flex gap-2 items-center">
              <input v-model="tag.name" placeholder="DT"
                class="w-16 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />
              <input v-model.number="tag.checks" type="number" placeholder="Checks"
                class="w-20 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />
            </div>
            <button @click="addTag('unmastered', idx, { name: 'DTS', checks: 1 })"
              class="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm">
              ➕ Adicionar DT
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
