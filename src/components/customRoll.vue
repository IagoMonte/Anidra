<script setup>
import { defineProps,defineEmits } from 'vue'


const props = defineProps({
  label: {
    type: String,
    required: true
  },
  CustomNumDice: {
    type: Number,
    default: 2  // Default se pai não passar
  },
  CustomSides: {
    type: Number,
    default: 6
  },
  CustomBonus: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:CustomBonus','update:CustomNumDice','update:CustomSides'])

const corners = [
  { pos: "top-0 left-0", rot: "rot-0" },
  { pos: "top-0 right-0", rot: "rot-90" },
  { pos: "bottom-0 right-0", rot: "rot-180" },
  { pos: "bottom-0 left-0", rot: "rot-270" },
]

function updateNumDice(newValue) {
  const clampedValue = Math.max(1, newValue)
  emit('update:CustomNumDice', clampedValue)  // Emite para o pai atualizar seu estado
}

function updateDiceSides(newValue) {
  const clampedValue = Math.max(2, newValue)
  emit('update:CustomSides', clampedValue)
}

function updateBonus(newValue) {
  emit('update:CustomBonus', newValue)  // Pode ser negativo
}
</script>

<template>
  <div class="card hover:cursor-pointer max-w-[200px] sm:max-w-xs p-3 sm:p-4 w-full">
    <!-- Label principal -->
    <span class="text-amber-300 font-serif tracking-wide text-sm sm:text-base block mb-4 text-center sm:text-left border-b border-gray-700 pb-2">
      {{ label }}
    </span>

    <!-- NOVO: Controles verticais (grid para alinhamento; labels à esquerda em sm+, acima em mobile) -->
    <div class="space-y-3 sm:space-y-4">
      <!-- X (Dados) -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
        <label class="text-gray-300 font-serif text-xs sm:text-sm min-w-[60px] sm:text-right font-semibold text-amber-400">Dados:</label>
        <div class="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <button @click.stop="updateNumDice(CustomNumDice - 1)" class="w-5 h-5 bg-gray-700 rounded hover:bg-gray-600 transition-all flex-shrink-0 disabled:opacity-50" :disabled="CustomNumDice <= 1">−</button>
          <input type="text" :value="CustomNumDice" readonly class="w-8 sm:w-10 text-center bg-gray-800 rounded text-sm font-bold border border-gray-600 px-1 flex-1 sm:flex-none" />
          <button @click.stop="updateNumDice(CustomNumDice + 1)" class="w-5 h-5 bg-gray-700 rounded hover:bg-gray-600 transition-all flex-shrink-0">+</button>
        </div>
      </div>

      <!-- Y (Faces) -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
        <label class="text-gray-300 font-serif text-xs sm:text-sm min-w-[60px] sm:text-right font-semibold text-amber-400">Faces:</label>
        <div class="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <button @click.stop="updateDiceSides(CustomSides - 1)" class="w-5 h-5 bg-gray-700 rounded hover:bg-gray-600 transition-all flex-shrink-0 disabled:opacity-50" :disabled="CustomSides <= 2">−</button>
          <input type="text" :value="CustomSides" readonly class="w-8 sm:w-10 text-center bg-gray-800 rounded text-sm font-bold border border-gray-600 px-1 flex-1 sm:flex-none" />
          <button @click.stop="updateDiceSides(CustomSides + 1)" class="w-5 h-5 bg-gray-700 rounded hover:bg-gray-600 transition-all flex-shrink-0">+</button>
        </div>
      </div>

      <!-- Z (Bônus) -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
        <label class="text-gray-300 font-serif text-xs sm:text-sm min-w-[60px] sm:text-right font-semibold text-amber-400">Bônus:</label>
        <div class="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <button @click.stop="updateBonus(CustomBonus - 1)" class="w-5 h-5 bg-gray-700 rounded hover:bg-gray-600 transition-all flex-shrink-0">−</button>
          <input type="text" :value="CustomBonus" readonly class="w-8 sm:w-10 text-center bg-gray-800 rounded text-sm font-bold border border-gray-600 px-1 flex-1 sm:flex-none" />
          <button @click.stop="updateBonus(CustomBonus + 1)" class="w-5 h-5 bg-gray-700 rounded hover:bg-gray-600 transition-all flex-shrink-0">+</button>
        </div>
      </div>
    </div>

    <!-- NOVO: Preview sutil no rodapé -->
    <div class="mt-3 pt-2 border-t border-gray-700 text-center text-xs text-gray-400 font-serif">
      Fórmula: {{ CustomNumDice }}D{{ CustomSides }} + {{ CustomBonus }}
    </div>

    <!-- Cantos com PNG -->
    <div v-for="(c, i) in corners" :key="i" class="corner absolute w-4 h-4 sm:w-5 sm:h-5" :class="[c.pos, c.rot]">
      <img src="/src/assets/img/image.svg" class="w-full h-full object-contain" />
    </div>
  </div>
</template>

<style scoped>
/* Seu style original mantido (sem mudanças) */
.card {
  position: relative;
  background: rgba(10, 18, 20, 0.85);
  padding: 0.50rem 1rem;

  border: 3px solid #3d3d3d;
  border-radius: 8px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.8);

  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.card:hover {
  border-color: #15ccfa;
  box-shadow:
    0 0 12px rgba(21, 216, 250, 0.7),
    0 0 24px rgba(21, 177, 250, 0.4),
    inset 0 0 8px rgba(21, 177, 250, 0.2);

  .corner {
    pointer-events: none;
    filter: drop-shadow(0 0 6px rgb(84, 217, 250));
  }

}

/* Runas decorativas */
.card::before {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 6px;
  pointer-events: none;
  animation: runeGlow 5s linear infinite;
}

@keyframes runeGlow {
  0% {
    opacity: 0.3;
    filter: blur(1px);
  }

  50% {
    opacity: 0.8;
    filter: blur(2px);
  }

  100% {
    opacity: 0.3;
    filter: blur(1px);
  }
}

.corner {
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(180, 135, 83, 0.849));
}

.rot-0 {
  transform: rotate(0deg);
}

.rot-90 {
  transform: rotate(90deg);
}

.rot-180 {
  transform: rotate(180deg);
}

.rot-270 {
  transform: rotate(270deg);
}

/* puxando levemente pra fora */
.top-0 {
  top: -3px;
}

.right-0 {
  right: -3px;
}

.bottom-0 {
  bottom: -3px;
}

.left-0 {
  left: -3px;
}
</style>