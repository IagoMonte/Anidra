<script setup>
import { reactive, ref } from "vue"
import {updateMetada, getMetadaById } from "@/owlbear/syncCharacterMetadata"

const props = defineProps({
  charData: { type: Object, required: true },
  charId: { type: String, required: true }
})
const emit = defineEmits(['updateData'])
// ================================
// Estado
// ================================
const notes = reactive([
  ...(props.charData.notes|| [])
])

// ================================
// Edição
// ================================
const editingNotes = ref(false)
const tempNotes = ref([])
const openedNote = ref(null) // índice da nota aberta para edição rápida

// ================================
// Funções
// ================================
function startEdit() {
  editingNotes.value = true
  tempNotes.value = notes.map(note => ({ ...note }))
}

async function confirmEdit() {
  notes.splice(0, notes.length, ...tempNotes.value)
  editingNotes.value = false
  openedNote.value = null

  let currentData = await getMetadaById(props.charId)

  currentData.info.Stats.notes = JSON.parse(JSON.stringify(notes))
  
  try {
    await updateMetada(props.charId, currentData)
    console.log("Metadata atualizado com sucesso!")
  } catch (err) {
    console.error("Erro ao atualizar metadata:", err)
  }
  emit("updateData",props.charId)


}

function cancelEdit() {
  editingNotes.value = false
  openedNote.value = null
}

function addNote() {
  startEdit()
  const newNote = { title: "Nova Nota", content: "" }
  const target = editingNotes.value ? tempNotes.value : notes
  target.push(newNote)
  confirmEdit()
}

function removeNote(idx) {
  startEdit()
  const target = editingNotes.value ? tempNotes.value : notes
  target.splice(idx, 1)
  confirmEdit()
}

function toggleNote(idx) {
  openedNote.value = openedNote.value === idx ? null : idx
}
</script>

<template>
  <main class="bg-[#121212] text-white h-screen p-4 flex flex-col">

    <!-- Título e botões de edição -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Notas</h1>
      <div class="flex gap-2">
        <button v-if="!editingNotes" @click="startEdit"
          class="text-sm text-gray-400 hover:text-white">
            Editar</button>
        <template v-else>
          <button @click="confirmEdit" class="text-sm text-green-400 hover:text-green-200">
              ✔ Confirmar</button>
          <button @click="cancelEdit" class="text-sm text-red-400 hover:text-red-200">
              ✖ Cancelar</button>
        </template>
      </div>
    </div>

    <!-- Botão adicionar nota -->
    <button @click="addNote"
      class="flex items-center gap-2 bg-[#f2c500] text-black text-[16px] font-normal rounded-md px-6 py-3 mb-4">
      <i class="fas fa-plus text-[20px]"></i>
      ADICIONAR NOTA
    </button>

    <!-- Lista rolável de notas -->
    <div class="flex-1 overflow-y-auto space-y-4">
      <div v-for="(note, idx) in (editingNotes ? tempNotes : notes)" :key="idx"
        class="border border-gray-600 rounded p-3">

        <!-- Modo visualização -->
        <div v-if="!editingNotes && openedNote !== idx" @click="toggleNote(idx)" class="cursor-pointer">
          <div class="flex justify-between items-center">
            <h2 class="text-white text-[20px] font-normal">{{ note.title }}</h2>
            <button @click.stop="removeNote(idx)"
              class="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">🗑</button>
          </div>
          <p class="text-gray-400 text-[16px] font-normal">
            {{ note.content.split('\n')[0] }}
          </p>
        </div>

        <!-- Modo edição/aberto -->
        <div v-else class="space-y-2">
          <input v-model="note.title" placeholder="Título"
            class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />
          <textarea v-model="note.content" placeholder="Conteúdo"
            class="w-full h-65 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600"></textarea>
          <button v-if="!editingNotes" @click="toggleNote(idx)"
            class="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">Fechar</button>
        </div>

      </div>
    </div>

  </main>
</template>
