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

import Inventory from './components/Inventory.vue'
import Char from './components/Char.vue'
import Rolls from './components/Rolls.vue'
import Skills from './components/Skills.vue'
import Notes from './components/Notes.vue'
import { setupAnidra } from './owlbear/contextMenu.js'

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
  const characters = await OBR.scene.items.getItems(
    (item) => item.layer === "CHARACTER" && item.type === "IMAGE"
  )
  return characters.map(char => ({
    charId: char.id,
    label: char.name || "Sem nome",
    icon: char.image?.url || "🧙",
    visible: char.visible,
    data: char.metadata?.info.Stats
  }))
}

async function loadMenuItems() {
  try {
    const characters = await getAnidraCharacters()
    menuItems.value = characters
  } catch (err) {
    console.error('Erro ao carregar personagens do AnidraCtl:', err)
  }
}


OBR.onReady(() => {
  setupAnidra()
  OBR.scene.onReadyChange(() => {
    loadMenuItems()
  })

  OBR.scene.items.onChange(() => {
    loadMenuItems()
  })
})
</script>
<template>
  <div class="relative h-screen flex">
    <!-- Menu lateral -->
    <aside :class="[
      'bg-gray-800 text-white h-full transition-all duration-300 ease-in-out overflow-hidden',
      isOpen ? 'w-48' : 'w-16'
    ]" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
      <ul class="flex flex-col mt-4 space-y-2">
        <li v-for="(item, idx) in menuItems" :key="item.id"
          class="flex items-center cursor-pointer hover:bg-gray-700 rounded px-2 py-3 transition-colors"
          @click="selectedChar = item">
          <img v-if="item.icon !== '🧙'" :src="item.icon" alt="char" class="w-8 h-8 rounded-full mr-3 object-cover" />
          <span v-else class="text-xl mr-3">{{ item.icon }}</span>
          <span class="whitespace-nowrap transition-opacity duration-300" :class="isOpen ? 'opacity-100' : 'opacity-0'">
            {{ item.label }}
          </span>
        </li>
      </ul>
    </aside>

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
          <main class="flex-1 overflow-auto p-4 bg-[#121212]">
            <template v-if="selectedChar">
              <section v-if="current === 'Stats'">
                <Char v-bind="selectedChar" />
              </section>
              <section v-else-if="current === 'Skills'">
                <Skills v-bind="selectedChar" />
              </section>
              <section v-else-if="current === 'Roll'">
                <Rolls v-bind="selectedChar" />
              </section>
              <section v-else-if="current === 'Inventory'">
                <Inventory v-bind="selectedChar" />
              </section>
              <section v-else-if="current === 'Notes'">
                <Notes v-bind="selectedChar" />
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
