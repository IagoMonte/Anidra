<script setup>
import { reactive, ref } from "vue"
import SkillCard from "./SkillCard.vue"
import OBR from "@owlbear-rodeo/sdk"

const ID = "com.anidra.addto"

// Props recebem o charData completo
const props = defineProps({
  charData: { type: Object, required: true },
  charId: { type: String, required: true }
})

// ================================
// Estado
// ================================
const masteredSkills = reactive(
  props.charData.skills?.masteredSkills?.map(s => ({ ...s })) || [
    {
      title: "Habilidade",
      tags: [
        { name: "combate", checks: 1 },
        { name: "campanha", checks: 1 }
      ],
      description: "Descricao da Habilidade",
      completed: true
    }
  ]
)

const unmasteredSkills = reactive(
  props.charData.skills?.unmasteredSkills?.map(s => ({ ...s })) || [
    {
      title: "Habilidade não dominada",
      tags: [
        { name: "10", checks: 1 },
        { name: "8", checks: 2 },
        { name: "6", checks: 4 },
        { name: "4", checks: 6 }
      ],
      description: "Não dominada ainda.",
      completed: false
    }
  ]
)

// Flags de edição
const editingMastered = ref(false)
const editingUnmastered = ref(false)

// Temporários para edição
const tempMastered = ref([])
const tempUnmastered = ref([])

// ================================
// Função para atualizar metadata
// ================================
function updateSkillsMetadata() {
  const newSheet = {
    ...props.charData,
    skills: {
      masteredSkills: masteredSkills.map(s => JSON.parse(JSON.stringify(s))),
      unmasteredSkills: unmasteredSkills.map(s => JSON.parse(JSON.stringify(s)))
    }
  }

  OBR.scene.items.updateItems([props.charId], (items) => {
    for (let item of items) {
      item.metadata[`${ID}/metadata`] = { info: { Stats: newSheet } }
    }
  })
}

// ================================
// Funções de edição
// ================================
function startEdit(section) {
  if (section === "mastered") {
    editingMastered.value = true
    tempMastered.value = masteredSkills.map(s => ({ ...s }))
  }
  if (section === "unmastered") {
    editingUnmastered.value = true
    tempUnmastered.value = unmasteredSkills.map(s => ({ ...s }))
  }
}

function confirmEdit(section) {
  if (section === "mastered") {
    masteredSkills.splice(0, masteredSkills.length, ...tempMastered.value)
    editingMastered.value = false
  }
  if (section === "unmastered") {
    unmasteredSkills.splice(0, unmasteredSkills.length, ...tempUnmastered.value)
    editingUnmastered.value = false
  }

  updateSkillsMetadata()
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
    ? editingMastered.value ? tempMastered.value : masteredSkills
    : editingUnmastered.value ? tempUnmastered.value : unmasteredSkills

  target.push(newSkill)
  updateSkillsMetadata()
}

function removeSkill(section, idx) {
  const target = section === "mastered"
    ? editingMastered.value ? tempMastered.value : masteredSkills
    : editingUnmastered.value ? tempUnmastered.value : unmasteredSkills

  target.splice(idx, 1)
  updateSkillsMetadata()
}

function addTag(section, skillIdx, newTag = { name: "DT", checks: 1 }) {
  const targetSkill = section === "mastered"
    ? editingMastered.value ? tempMastered.value[skillIdx] : masteredSkills[skillIdx]
    : editingUnmastered.value ? tempUnmastered.value[skillIdx] : unmasteredSkills[skillIdx]

  targetSkill.tags.push({ ...newTag })
  updateSkillsMetadata()
}
</script>
