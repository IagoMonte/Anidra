<script setup>
import { ref } from "vue";
import Notification from '@/components/Notification.vue'

const emit = defineEmits(["login-success"]);

const username = ref("");
const password = ref("");
const message = ref("");
const showNotification = ref(false)
const msgNotification = ref('')

function openNotification(msg) {
  showNotification.value = true
  msgNotification.value = msg

}


async function handleLogin() {
  message.value = "";
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      message.value = data || "Usuário ou senha inválidos";
      openNotification(message.value)
    } else {
      localStorage.setItem("token", data.token);
      message.value = "Login bem-sucedido!";
      openNotification(message.value)
      username.value = "";
      password.value = "";
      emit("login-success");
      router.push("/")
    }
  } catch (err) {
    console.error(err);
    message.value = "Erro ao conectar com o servidor";
    openNotification(message.value)
  }
}
</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-[#121212] text-white p-4">
    <div class="bg-[#1E1E1E] p-6 rounded-lg border border-gray-600 w-full max-w-md">
      <h1 class="text-xl font-bold mb-6">Entrar na sua conta</h1>
      
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label class="text-gray-400 mb-1" for="email">Nome de Usuário</label>
          <input 
            type="username" 
            id="username"
            v-model="username" 
            class="p-3 rounded-md border border-gray-600 bg-[#121212] text-white focus:ring-2 focus:ring-yellow-500" 
            placeholder="Digite seu Usuário"
          />
        </div>

        <div class="flex flex-col">
          <label class="text-gray-400 mb-1" for="password">Senha</label>
          <input 
            type="password" 
            id="password"
            v-model="password" 
            class="p-3 rounded-md border border-gray-600 bg-[#121212] text-white focus:ring-2 focus:ring-yellow-500" 
            placeholder="Digite sua senha"
          />
        </div>

        <button 
          type="submit" 
          class="mt-4 bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-400 transition-colors"
        >
          Entrar
        </button>
      </form>

      <p class="text-gray-300 mt-4 text-sm">
        Não tem uma conta? 
        <router-link to="/register" class="text-yellow-500 hover:text-yellow-400">Registrar-se</router-link>
      </p>
    </div>
  </div>
  <Notification v-model="showNotification" :message="msgNotification" :duration="3000" />
</template>
