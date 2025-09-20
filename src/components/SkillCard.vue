<script setup>
import { ref, watch, defineEmits } from "vue"

const emit = defineEmits(["mastered", 'update'])

const { title, tags, description, completed } = defineProps({
  title: String,
  tags: {
    type: Array,
    default: () => [
      { name: "10", checks: 1, checked:[false] },
      { name: "8", checks: 2, checked:[false, false] },
      { name: "6", checks: 4, checked:[false, false, false, false] },
      { name: "4", checks: 6, checked:[false, false, false, false, false, false] }
    ]
  },
  description: String,
  completed: {
    type: Boolean,
    default: true
  }
})

// Cantos decorativos
const corners = [
  { pos: "top-0 left-0", rot: "rot-0" },
  { pos: "top-0 right-0", rot: "rot-90" },
  { pos: "bottom-0 right-0", rot: "rot-180" },
  { pos: "bottom-0 left-0", rot: "rot-270" },
]

// Watch para emitir evento quando todos testes são concluídos
watch(
  () => tags,  // <- usa função getter
  (val) => {
    if (!completed) {
      const allDone = val.every(tag => tag.checked.every(c => c))
      if (allDone) {
        emit("mastered", title)
      }
    }

    // Emitir sempre o auto-save
    emit("update", { title, tags })
  },
  { deep: true }
)
</script>

<template>
  <article
    class="relative border-2 border-gray-700 rounded-lg bg-[rgba(10,18,20,0.85)] shadow-md p-4 flex items-start transition hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] overflow-hidden"
    :class="{ 'opacity-70': !completed }"
  >
    <!-- Cantos ornamentados -->
    <div v-for="(c, i) in corners" :key="i" class="absolute w-6 h-6 overflow-visible" :class="[c.pos, c.rot]">
      <img src="/src/assets/img/image.svg" class="w-full h-full object-contain" />
    </div>

    <!-- Conteúdo principal -->
    <div class="flex-1">
      <h2 class="text-lg font-bold mb-2 text-white">{{ title }}</h2>

      <!-- Se já está dominada -->
      <template v-if="completed">
        <div v-for="(tag, idx) in tags" :key="idx" class="mb-2">
          <span class="text-xs uppercase text-gray-400 mr-2">{{ tag.name }}</span>
          <div class="inline-flex space-x-2">
            <input
              v-for="(c, cIdx) in tag.checks"
              :key="cIdx"
              type="checkbox"
              v-model="tag.checked[cIdx]"
              class="w-5 h-5 rounded border border-gray-500 bg-transparent checked:bg-green-500 checked:border-green-500 transition"
              :disabled="!completed"
            />
          </div>
        </div>
      </template>

      <!-- Se ainda NÃO dominada -->
      <template v-else>
        <div v-for="(tag, idx) in tags" :key="idx" class="mb-2">
          <span class="text-xs uppercase text-red-400 mr-2">DT {{ tag.name }}</span>
          <div class="inline-flex space-x-2">
            <input
              v-for="(c, cIdx) in tag.checks"
              :key="cIdx"
              type="checkbox"
              v-model="tag.checked[cIdx]"
              class="w-5 h-5 rounded border border-gray-500 bg-transparent checked:bg-yellow-500 checked:border-yellow-500 transition"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- Descrição -->
    <div
      class="ml-4 bg-[rgba(30,30,30,0.8)] p-3 text-xs leading-relaxed max-w-[220px] rounded-md border border-gray-600 italic"
    >
      {{ description }}
    </div>
  </article>
</template>

<style scoped>
.rot-0   { transform: rotate(0deg); }
.rot-90  { transform: rotate(90deg); }
.rot-180 { transform: rotate(180deg); }
.rot-270 { transform: rotate(270deg); }
</style>
