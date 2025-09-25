<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const username = ref("")
const name = ref("")
const password = ref("")
const confirmPassword = ref("")
const message = ref("")

async function handleRegister() {
    message.value = ""

    if (password.value !== confirmPassword.value) {
        message.value = "As senhas não coincidem!"
        return
    }
    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.value,
                name: name.value,
                password: password.value
            })
        })

        const data = await res.json()

        if (!res.ok) {
            message.value = data?.message || "Erro ao registrar"
        } else {
            // Registro OK, faz login automático
            const loginRes = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value
                })
            })
            const loginData = await loginRes.json()

            if (!loginRes.ok) {
                message.value = loginData?.message || "Registro OK, mas houve erro ao logar."
            } else {
                localStorage.setItem("token", loginData.token)
                message.value = "Usuário registrado e logado com sucesso!"
                username.value = ""
                name.value = ""
                password.value = ""
                confirmPassword.value = ""
                router.push("/") // redireciona para home
            }
        }
    } catch (err) {
        console.error(err)
        message.value = "Erro ao conectar com o servidor"
    }
}
</script>


<template>
    <div class="min-h-screen flex items-center justify-center bg-[#121212] text-white p-4">
        <div class="bg-[#1E1E1E] p-6 rounded-lg border border-gray-600 w-full max-w-md">
            <h1 class="text-xl font-bold mb-6">Criar nova conta</h1>

            <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
                <div class="flex flex-col">
                    <label class="text-gray-400 mb-1" for="name">Nome de Usuário</label>
                    <input type="text" v-model="username" id="username"
                        class="p-3 rounded-md border border-gray-600 bg-[#121212] text-white focus:ring-2 focus:ring-yellow-500"
                        placeholder="Digite seu nome" />
                </div>

                <div class="flex flex-col">
                    <label class="text-gray-400 mb-1" for="name">Nome</label>
                    <input type="text" v-model="name" id="name"
                        class="p-3 rounded-md border border-gray-600 bg-[#121212] text-white focus:ring-2 focus:ring-yellow-500"
                        placeholder="Digite o nome do seu personagem" />
                </div>

                <div class="flex flex-col">
                    <label class="text-gray-400 mb-1" for="password">Senha</label>
                    <input type="password" v-model="password" id="password"
                        class="p-3 rounded-md border border-gray-600 bg-[#121212] text-white focus:ring-2 focus:ring-yellow-500"
                        placeholder="Digite sua senha" />
                </div>

                <div class="flex flex-col">
                    <label class="text-gray-400 mb-1" for="confirmPassword">Confirmar senha</label>
                    <input type="password" v-model="confirmPassword" id="confirmPassword"
                        class="p-3 rounded-md border border-gray-600 bg-[#121212] text-white focus:ring-2 focus:ring-yellow-500"
                        placeholder="Confirme sua senha" />
                </div>

                <button type="submit"
                    class="mt-4 bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-400 transition-colors cursor-pointer">
                    Registrar
                </button>
            </form>

            <p class="text-gray-300 mt-4 text-sm">
                Já tem uma conta?
                <router-link to="/login" class="text-yellow-500 hover:text-yellow-400">Entrar</router-link>
            </p>
        </div>
    </div>
</template>