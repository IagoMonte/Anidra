<script setup>
import { ref, onMounted } from 'vue';
import OBR, { isImage } from '@owlbear-rodeo/sdk';

// Lista de itens do menu (vai receber os personagens)
const menuItems = ref([]);

// Estado para saber se o menu está aberto
const isOpen = ref(false);

async function getAnidraCharacters() {
  // Busca todos os itens da camada "CHARACTER" que são imagens
  const characters = await OBR.scene.items.getItems(
    (item) => item.layer === "CHARACTER" && isImage(item)
  );

  // Mapear para o formato do menu: label + icon (imagem ou emoji)
  return characters.map(char => ({
    id: char.id,
    label: char.name,
    icon: char.metadata?.imageUrl || '🧙', // usa a imagem se existir, senão emoji
    visible: char.visible,
    count: char.count || 1,
  }));
}

async function loadMenuItems() {
  try {
    const characters = await getAnidraCharacters();
    menuItems.value = characters;
  } catch (err) {
    console.error('Erro ao carregar personagens do AnidraCtl:', err);
  }
}

// Carrega a lista quando o componente montar
onMounted(() => {
  loadMenuItems();
});
</script>

<template>
  <div 
    class="relative h-screen flex"
    @mouseenter="isOpen = true" 
    @mouseleave="isOpen = false"
  >
    <!-- Menu lateral -->
    <aside 
      :class="[
        'bg-gray-800 text-white h-full transition-all duration-300 ease-in-out overflow-hidden',
        isOpen ? 'w-48' : 'w-16'
      ]"
    >
      <ul class="flex flex-col mt-4 space-y-2">
        <li 
          v-for="(item, idx) in menuItems" 
          :key="item.id"
          class="flex items-center cursor-pointer hover:bg-gray-700 rounded px-2 py-3 transition-colors"
        >
          <img 
            v-if="item.icon !== '🧙'" 
            :src="item.icon" 
            alt="char" 
            class="w-8 h-8 rounded-full mr-3 object-cover"
          />
          <span v-else class="text-xl mr-3">{{ item.icon }}</span>
          <span 
            class="whitespace-nowrap transition-opacity duration-300" 
            :class="isOpen ? 'opacity-100' : 'opacity-0'"
          >
            {{ item.label }}
          </span>
        </li>
      </ul>
    </aside>

    <!-- Conteúdo principal -->
    <div class="flex-1 bg-gray-900">
      <!-- Aqui você pode renderizar detalhes do personagem selecionado -->
    </div>
  </div>
</template>

<style scoped>
aside {
  box-shadow: 2px 0 8px rgba(0,0,0,0.2);
}
</style>
