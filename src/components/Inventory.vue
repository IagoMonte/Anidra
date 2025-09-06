<script setup>
import { reactive, ref } from "vue"

// ================================
// Estado
// ================================
const inventory = reactive([
  {
    name: "Soco Inglês Melhorado",
    quantity: 1,
    description: "1d6+2 de dano, extra em acertos críticos"
  }
])

// ================================
// Edição
// ================================
const editingInventory = ref(false)
const tempInventory = ref([])

// ================================
// Funções
// ================================
function startEdit() {
  editingInventory.value = true
  // deep copy para não alterar original até confirmar
  tempInventory.value = inventory.map(item => ({ ...item }))
}

function confirmEdit() {
  inventory.splice(0, inventory.length, ...tempInventory.value)
  editingInventory.value = false
}

function cancelEdit() {
  editingInventory.value = false
}

function addItem() {
  const newItem = { name: "Novo Item", quantity: 1, description: "" }
  const target = editingInventory.value ? tempInventory.value : inventory
  target.push(newItem)
}

function removeItem(idx) {
  const target = editingInventory.value ? tempInventory.value : inventory
  target.splice(idx, 1)
}
</script>

<template>
  <main class="bg-[#121212] text-white h-screen p-4 flex flex-col">

    <!-- Título e botões de edição -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Inventário</h1>
      <div class="flex gap-2">
        <button v-if="!editingInventory" @click="startEdit"
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

    <!-- Botão adicionar item -->
    <button @click="addItem"
      class="flex items-center gap-2 bg-[#f2c500] text-black text-[16px] font-normal rounded-md px-6 py-3 mb-4">
      <i class="fas fa-plus text-[20px]"></i>
      ADICIONAR ITENS
    </button>

    <!-- Lista rolável de itens -->
    <div class="flex-1 overflow-y-auto space-y-4">
      <div v-for="(item, idx) in (editingInventory ? tempInventory : inventory)" :key="idx"
        class="border border-gray-600 rounded p-3">

        <div v-if="!editingInventory">
          <div class="flex justify-between items-center">
            <h2 class="text-white text-[20px] font-normal">{{ item.name }}</h2>
            <p class="text-gray-400">Qtd: {{ item.quantity }}</p>
          </div>
          <p class="text-gray-400 text-[16px] font-normal">{{ item.description }}</p>
        </div>

        <div v-else class="space-y-2">
          <input v-model="item.name" placeholder="Nome"
            class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />
          <input v-model.number="item.quantity" type="number" placeholder="Quantidade"
            class="w-32 bg-gray-800 text-white rounded px-2 py-1 border border-gray-600" />
          <textarea v-model="item.description" placeholder="Descrição"
            class="w-full bg-gray-800 text-white rounded px-2 py-1 border border-gray-600"></textarea>
          <button @click="removeItem(idx)"
            class="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm">🗑 Remover</button>
        </div>

      </div>
    </div>

  </main>
</template>
