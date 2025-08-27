<script setup>
import { ref } from 'vue'
import Char from './components/Char.vue';
const current = ref('home') // estado inicial

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white flex space-x-4 p-4">
      <button @click="current = 'home'" class="hover:bg-gray-700 px-3 py-2 rounded">
        Home
      </button>
      <button @click="current = 'about'" class="hover:bg-gray-700 px-3 py-2 rounded">
        About
      </button>
      <button @click="current = 'contact'" class="hover:bg-gray-700 px-3 py-2 rounded">
        Contact
      </button>
    </nav>

    <!-- Conteúdo que muda -->
    <main class="flex-1 p-6">
      <section v-if="current === 'home'">
        <h1 class="text-2xl font-bold">Página Home</h1>
        <Char/>
      </section>

      <section v-else-if="current === 'about'">
        <h1 class="text-2xl font-bold">Sobre</h1>
        <p>Alguma descrição da sua aplicação.</p>
      </section>

      <section v-else-if="current === 'contact'">
        <h1 class="text-2xl font-bold">Contato</h1>
        <p>Formulário ou informações de contato aqui.</p>
      </section>
    </main>
  </div>
</template>
<style scoped></style>
