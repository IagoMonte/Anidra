<script setup>
import { ref } from 'vue'
import OBR from '@owlbear-rodeo/sdk'
import {
  HeartIcon,
  CubeIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  SparklesIcon
} from "@heroicons/vue/24/solid"
import { setupAnidra } from '@/owlbear/contextMenu.js'
import { watch } from 'vue'
import { mytestdata } from '@/owlbear/datatest'
import Inventory from '@/components/Inventory.vue'
import Char from '@/components/Char.vue'
import Skills from '@/components/Skills.vue'
import Rolls from '@/components/Rolls.vue'
import Notes from '@/components/Notes.vue'

const test = true
const menuItems = ref([])
const isOpen = ref(false)
const current = ref('Stats')
const selectedChar = ref(null) // personagem selecionado

// Itens da navbar inferior
const navItems = [
  { label: "Stats", icon: HeartIcon },
  { label: "Skills", icon: SparklesIcon },
  { label: "Roll", icon: CubeIcon },
  { label: "Inventory", icon: ArchiveBoxIcon },
  { label: "Notes", icon: DocumentTextIcon },
]

async function getAnidraCharacters() {
  if(test === true){
      const characters = await mytestdata()
      console.log(characters)
      return characters
  }

}

async function loadChar() {
  try {
    const characters = await getAnidraCharacters()
    selectedChar.value = characters[1] 
  } catch (err) {
    console.error('Erro ao carregar personagens do AnidraCtl:', err)
  }
}
function getMenuItemById(id) {
  return menuItems.value.find(item => item.charId === id)
}

function atualizarPersonagem(charid) {
  loadChar()
}

watch(current, async (newPage, oldPage) => {
  if (selectedChar.value) {
    await loadChar()
    atualizarPersonagem(selectedChar.value.charId) // 🔑 recarrega o char atualizado
  }
})
OBR.onReady(() => {
  setupAnidra()
  OBR.scene.onReadyChange(() => {
    loadChar()
  })

  OBR.scene.items.onChange(() => {
    loadChar()
  })
})
loadChar()
</script>
<template>
  <div class="relative h-screen flex overflow-hidden">
    <!-- Conteúdo principal -->
    <div class="flex-1 bg-gray-900">
      <div class="flex h-screen">
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Header -->
          <header
            class="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-gray-700 flex-shrink-0">
            <div>
              <h1 class="text-white text-lg font-normal">
                {{ selectedChar ? selectedChar.label : "Nenhum personagem" }}
              </h1>
              <p class="text-gray-500 text-xs -mt-1">{{ current }}</p>
            </div>

            <img v-if="selectedChar?.icon && selectedChar.icon !== '🧙'" :src="selectedChar.icon" alt="Imagem de perfil"
              class="rounded-full border border-gray-600" height="64" width="64" />
          </header>

          <!-- Conteúdo que muda -->
          <main class="flex-1 overflow-auto p-4 bg-[#121212] pb-20">
            <template v-if="selectedChar">
              <section v-if="current === 'Stats'">
                <Char :charData="selectedChar.data.info.Stats" :charId="selectedChar.charId"
                  @updateData="atualizarPersonagem" />
              </section>
              <section v-else-if="current === 'Skills'">
                <Skills :charData="selectedChar.data.info.Stats" :charId="selectedChar.charId"
                  @updateData="atualizarPersonagem" />
              </section>
              <section v-else-if="current === 'Roll'">
                <Rolls :charData="selectedChar.data.info.Stats" :charId="selectedChar.charId"
                  @updateData="atualizarPersonagem" />
              </section>
              <section v-else-if="current === 'Inventory'">
                <Inventory :charData="selectedChar.data.info.Stats" :charId="selectedChar.charId"
                  @updateData="atualizarPersonagem" />
              </section>
              <section v-else-if="current === 'Notes'">
                <Notes :charData="selectedChar.data.info.Stats" :charId="selectedChar.charId"
                  @updateData="atualizarPersonagem" />
              </section>
            </template>
            <template v-else>
              <div class="h-full flex items-center justify-center text-gray-500 text-lg">
                Nenhum personagem selecionado
              </div>
            </template>
          </main>

          <!-- Navbar inferior -->
          <nav
            class="flex-shrink-0 fixed bottom-0 left-0 w-full bg-[#2a2a2a] border-t border-gray-700 flex justify-around py-2 text-gray-400 text-xs font-mono">
            <button v-for="(item, i) in navItems" :key="i" class="flex flex-col items-center space-y-1"
              :class="current === item.label ? 'text-white' : 'text-gray-400'" @click="current = item.label">
              <component :is="item.icon" class="w-6 h-6" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
