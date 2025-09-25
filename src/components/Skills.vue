<script setup>
import { reactive, ref, toRaw } from "vue"
import SkillCard from "@/components/SkillCard.vue"
import { getMetadaById, updateMetada } from "@/owlbear/syncCharacterMetadata"

const props = defineProps({
  charData: { type: Object, required: true },
  charId: { type: String, required: true },
  standAlone: { type: Boolean, required: false }
})
// ================================
// Estado
// ================================
const emit = defineEmits(['updateData'])

const masteredSkills = reactive([
  ...(props.charData.skills?.masteredSkills || [])
])
const unmasteredSkills = reactive([
  ...(props.charData.skills?.unmasteredSkills || [])
])

const editingMastered = ref(false)
const editingUnmastered = ref(false)

const tempMastered = ref([])
const tempUnmastered = ref([])

// ================================
// Funções
// ================================
async function saveSkillUpdate(section, idx, payload) {
  if (props.standAlone) {
    let currentData = props.charData
    if (section === "mastered") {
      currentData.skills.masteredSkills[idx].tags = JSON.parse(JSON.stringify(payload.tags))
    } else {
      currentData.skills.unmasteredSkills[idx].tags = JSON.parse(JSON.stringify(payload.tags))
    }
    await updateCharSheet(currentData)
    //console.log('pq krls vc ta chamando esse krl inifinitamente seu demonio?')
    return
  } else {
    let currentData = await getMetadaById(props.charId)
    if (section === "mastered") {
    currentData.info.Stats.skills.masteredSkills[idx].tags = JSON.parse(JSON.stringify(payload.tags))
  } else {
    currentData.info.Stats.skills.unmasteredSkills[idx].tags = JSON.parse(JSON.stringify(payload.tags))
  }
    try {
      await updateMetada(props.charId, currentData)
      console.log("Auto-save de checks concluído!")
    } catch (err) {
      console.error("Erro no auto-save:", err)
    }
  }
  emit("updateData", props.charId)
}

function addTag(section, skillIdx, newTag = { name: "DT", checks: 1, checked: [false] }) {
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

async function updateCharSheet(newSheet) {
  console.log('fui chamado')
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Nenhum token encontrado, usuário não autenticado");
    return;
  }

  try {
    const res = await fetch("/api/updateCharSheet", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ char_sheet: newSheet })
    });

    if (!res.ok) {
      throw new Error(`Erro ao atualizar ficha: ${res.status}`);
    }
    return true;
  } catch (err) {
    console.error("Erro na atualização da ficha:", err);
    return false;
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

  if (props.standAlone) {
    let currentData = props.charData
    currentData.skills.masteredSkills = JSON.parse(JSON.stringify(masteredSkills))
    currentData.skills.unmasteredSkills = JSON.parse(JSON.stringify(unmasteredSkills))
    await updateCharSheet(currentData)
  } else {
    let currentData = await getMetadaById(props.charId)
    currentData.info.Stats.skills.masteredSkills = JSON.parse(JSON.stringify(masteredSkills))
    currentData.info.Stats.skills.unmasteredSkills = JSON.parse(JSON.stringify(unmasteredSkills))
    try {
      await updateMetada(props.charId, currentData)
      console.log("Metadata atualizado com sucesso!")
    } catch (err) {
      console.error("Erro ao atualizar metadata:", err)
    }
  }

  emit("updateData", props.charId)
}

function cancelEdit(section) {
  if (section === "mastered") editingMastered.value = false
  if (section === "unmastered") editingUnmastered.value = false
}

function addSkill(section) {
  //startEdit(section)
  const newSkill = section === "mastered"
    ? { title: "Nova Habilidade", tags: [{ name: "Combate", checks: 1, checked: [false] }, { name: "Campanha", checks: 1, checked: [false] }], description: "Descrição...", completed: true }
    : { title: "Nova Habilidade", tags: [{ name: "10", checks: 1, checked: [false] }], description: "Descrição...", completed: false }

  const target = section === "mastered"
    ? (editingMastered.value ? tempMastered.value : masteredSkills)
    : (editingUnmastered.value ? tempUnmastered.value : unmasteredSkills)

  target.push(newSkill)
  //confirmEdit(section)
}
</script>


<template>
  <main class="bg-[#121212] min-h-screen text-white font-sans sm:p-4">
    <!-- DOMINADAS -->
    <section class="mb-6 border border-gray-600 rounded-lg p-3" :class="editingMastered ? 'ring-2 ring-green-500' : ''">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <h1 class="text-xl sm:text-2xl font-bold">Habilidades Dominadas</h1>
        <div class="flex gap-2 flex-wrap">
          <button v-if="!editingMastered" @click="startEdit('mastered')"
            class="text-xs sm:text-sm text-gray-400 hover:text-white">
            Editar
          </button>
          <template v-else>
            <button @click="confirmEdit('mastered')" class="text-xs sm:text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar
            </button>
            <button @click="cancelEdit('mastered')" class="text-xs sm:text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar
            </button>
          </template>
        </div>
      </div>

      <button v-if="editingMastered" @click="addSkill('mastered')"
        class="mb-4 px-3 py-2 bg-green-600 rounded hover:bg-green-500 text-xs sm:text-sm w-full sm:w-auto">
        ➕ Adicionar dominada
      </button>

      <div class="space-y-4">
        <div v-for="(skill, idx) in (editingMastered ? tempMastered : masteredSkills)" :key="idx"
          class="rounded space-y-2">

          <div v-if="!editingMastered">
            <SkillCard v-bind="skill" @update="saveSkillUpdate('mastered', idx, $event)" />
          </div>

          <div v-else class="space-y-2">
            <button @click="removeSkill('mastered', idx)"
              class="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs sm:text-sm">
              🗑 Remover
            </button>
            <input v-model="skill.title"
              class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base"
              placeholder="Título" />
            <textarea v-model="skill.description"
              class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base"
              placeholder="Descrição"></textarea>

            <!-- Tags/Checks -->
            <div v-for="(tag, tIdx) in skill.tags" :key="tIdx"
              class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <span class="text-xs sm:text-sm uppercase text-gray-400">{{ tag.name }}</span>
              <input v-model.number="tag.checks" type="number" placeholder="Checks"
                class="w-full sm:w-24 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NÃO DOMINADAS -->
    <section class="mb-6 border border-gray-600 rounded-lg p-3"
      :class="editingUnmastered ? 'ring-2 ring-yellow-500' : ''">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <h2 class="text-xl sm:text-2xl font-bold">Habilidades Não Dominadas</h2>
        <div class="flex gap-2 flex-wrap">
          <button v-if="!editingUnmastered" @click="startEdit('unmastered')"
            class="text-xs sm:text-sm text-gray-400 hover:text-white">
            Editar
          </button>
          <template v-else>
            <button @click="confirmEdit('unmastered')" class="text-xs sm:text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar
            </button>
            <button @click="cancelEdit('unmastered')" class="text-xs sm:text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar
            </button>
          </template>
        </div>
      </div>

      <button v-if="editingUnmastered" @click="addSkill('unmastered')"
        class="mb-4 px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-500 text-xs sm:text-sm w-full sm:w-auto">
        ➕ Adicionar não dominada
      </button>

      <div class="space-y-4">
        <div v-for="(skill, idx) in (editingUnmastered ? tempUnmastered : unmasteredSkills)" :key="idx"
          class="rounded space-y-2">

          <div v-if="!editingUnmastered">
            <SkillCard v-bind="skill" @update="saveSkillUpdate('unmastered', idx, $event)" />
          </div>

          <div v-else class="space-y-2">
            <button @click="removeSkill('unmastered', idx)"
              class="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs sm:text-sm">
              🗑 Remover
            </button>
            <input v-model="skill.title"
              class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base"
              placeholder="Título" />
            <textarea v-model="skill.description"
              class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base"
              placeholder="Descrição"></textarea>

            <div v-for="(tag, tIdx) in skill.tags" :key="tIdx"
              class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <input v-model="tag.name" placeholder="DT"
                class="w-full sm:w-16 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base" />
              <input v-model.number="tag.checks" type="number" placeholder="Checks"
                class="w-full sm:w-24 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600 text-sm sm:text-base" />
            </div>

            <button @click="addTag('unmastered', idx, { name: 'DTS', checks: 1, checked: [false] })"
              class="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs sm:text-sm w-full sm:w-auto">
              ➕ Adicionar DT
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
