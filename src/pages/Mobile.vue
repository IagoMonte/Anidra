<script setup>
import { ref, onMounted } from 'vue'
import {
  HeartIcon,
  CubeIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  SparklesIcon
} from "@heroicons/vue/24/solid"
import Inventory from '@/components/Inventory.vue'
import Char from '@/components/Char.vue'
import Skills from '@/components/Skills.vue'
import Rolls from '@/components/Rolls.vue'
import Notes from '@/components/Notes.vue'

const props = defineProps({
  userData: { type: Object, required: true }, // deve ter { id, username, char_sheet, ... }
})

const current = ref('Stats')
const selectedChar = ref(null)

// Itens da navbar inferior
const navItems = [
  { label: "Stats", icon: HeartIcon },
  { label: "Skills", icon: SparklesIcon },
  { label: "Roll", icon: CubeIcon },
  { label: "Inventory", icon: ArchiveBoxIcon },
  { label: "Notes", icon: DocumentTextIcon },
]

// inicializa com os dados do usuário que vieram por props
async function getUserCharSheet() {
  selectedChar.value = props.userData || null
}

async function AtualizarUserData() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      selectedChar.value = null;
      return;
    }

    const userData = await res.json();
    selectedChar.value = userData 
  } catch (err) {
    console.error(err);
    localStorage.removeItem("token");
    selectedChar.value = null;
  }
}

onMounted(() => {
  getUserCharSheet()
})
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
                                {{ selectedChar ? selectedChar.name : "Nenhum personagem" }}
                            </h1>
                            <p class="text-gray-500 text-xs -mt-1">{{ current }}</p>
                        </div>
                        <!-- 
            <img v-if="selectedChar?.icon && selectedChar.icon !== '🧙'" :src="selectedChar.icon" alt="Imagem de perfil"
              class="rounded-full border border-gray-600" height="64" width="64" /> -->
                    </header>

                    <!-- Conteúdo que muda -->
                    <main class="flex-1 overflow-auto p-4 bg-[#121212] pb-20">
                        <template v-if="selectedChar">
                            <section v-if="current === 'Stats'">
                                <Char :standAlone="true" :charData="selectedChar.char_sheet" :charId="selectedChar.id"
                                    @updateData="AtualizarUserData" />
                            </section>
                            <section v-else-if="current === 'Skills'">
                                <Skills :standAlone="true" :charData="selectedChar.char_sheet" :charId="selectedChar.id"
                                    @updateData="AtualizarUserData" />
                            </section>
                            <section v-else-if="current === 'Roll'">
                                <Rolls :standAlone="true" :charData="selectedChar.char_sheet" :charId="selectedChar.id"
                                    @updateData="AtualizarUserData" />
                            </section>
                            <section v-else-if="current === 'Inventory'">
                                <Inventory :standAlone="true" :charData="selectedChar.char_sheet" :charId="selectedChar.id"
                                    @updateData="AtualizarUserData" />
                            </section>
                            <section v-else-if="current === 'Notes'">
                                <Notes :standAlone="true" :charData="selectedChar.char_sheet" :charId="selectedChar.id"
                                    @updateData="AtualizarUserData" />
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
                            :class="current === item.label ? 'text-white' : 'text-gray-400'"
                            @click="current = item.label">
                            <component :is="item.icon" class="w-6 h-6" />
                            <span>{{ item.label }}</span>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
