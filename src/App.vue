<script setup>
import { ref } from 'vue'
const current = ref('Stats') // estado inicial
import {
  HeartIcon,
  CubeIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  SparklesIcon
} from "@heroicons/vue/24/solid"
import Inventory from './components/Inventory.vue';
import Char from './components/Char.vue';
import Rolls from './components/Rolls.vue';
import Skills from './components/Skills.vue';
import Notes from './components/Notes.vue';

const navItems = [
  { label: "Stats", icon: HeartIcon },
  { label: "Skills", icon: SparklesIcon },
  { label: "Roll", icon: CubeIcon },
  { label: "Inventory", icon: ArchiveBoxIcon },
  { label: "Notes", icon: DocumentTextIcon },
]

</script>

<template>
  <div class="flex flex-col">
    <header class="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-gray-700">
      <!-- Nome e página -->
      <div>
        <h1 class="text-white text-lg font-normal">Momon</h1>
        <p class="text-gray-500 text-xs -mt-1">{{ current }}</p>
      </div>

      <!-- Imagem de perfil -->
      <img alt="Imagem de perfil" class="rounded-full border border-gray-600" height="64" width="64"
        src="https://storage.googleapis.com/a1aa/image/526ee3ac-f82f-4b1c-8529-a72d1868105f.jpg" />
    </header>
    <!-- Conteúdo que muda -->
    <main>
      <section v-if="current === 'Stats'">
        <Char />
      </section>

      <section v-else-if="current === 'Skills'">
        <Skills />
      </section>

      <section v-else-if="current === 'Roll'">
        <Rolls />
      </section>

      <section v-else-if="current === 'Inventory'">
        <Inventory/>
      </section>

      <section v-else-if="current === 'Notes'">
        <Notes/>
      </section>
    </main>
    <nav
      class="fixed bottom-0 left-0 w-full bg-[#2a2a2a] border-t border-gray-700 flex justify-around py-2 text-gray-400 text-xs font-mono">
      <button v-for="(item, i) in navItems" :key="i" class="flex flex-col items-center space-y-1"
        :class="current === item.label ? 'text-white' : 'text-gray-400'"
        @click="current = item.label; item.active = true">
        <component :is="item.icon" class="w-6 h-6" />
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>
