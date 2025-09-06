<script setup>
import MolduraCard from './MolduraCard.vue';

const testes = [
  { label: "Percepção", value: "2d6+10" },
  { label: "Persuasão", value: "2d6+9" },
  { label: "Furtividade", value: "2d6+9" },
  { label: "Acrobacia", value: "2d6+11" },
  { label: "Acrobacia de combate", value: "2d6+10" },
  { label: "Linguagens", value: "2d6+10" },
  { label: "Persistência", value: "2d6+10" },
  { label: "Ataque", value: "2d6+9" },
  { label: "Defesa", value: "2d6+10" },
  { label: "Precisão", value: "2d6+10" },
]

const AtributosAtivos = [
  { label: "Força", value: "2d6+10" },
  { label: "Carisma", value: "2d6+9" },
  { label: "Sorte", value: "2d6+9" },
  { label: "Aura", value: "2d6+11" }
]
</script>

<template>
  <main class="bg-[#121212] text-white min-h-screen p-4">
    <h1 class="text-3xl font-semibold mb-3 border-b border-gray-700 pb-2">
      Testes
    </h1>

    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
      <MolduraCard
        v-for="(t, i) in testes"
        :key="i"
        :label="t.label"
        :value="t.value"
      />
    </div>
    <h1 class="text-3xl font-semibold mb-3 border-b border-gray-700 pb-2">
      Atributos Ativos
    </h1>

    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
      <MolduraCard
        v-for="(t, i) in AtributosAtivos"
        :key="i"
        :label="t.label"
        :value="t.value"
      />
    </div>
  </main>
</template>