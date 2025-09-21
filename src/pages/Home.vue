<script setup>
import Login from '@/components/Login.vue';
import Mobile from './Mobile.vue';
import { ref, onMounted } from "vue";

const user = ref(null);

async function fetchUserData() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      user.value = null;
      return;
    }

    user.value = await res.json();
  } catch (err) {
    console.error(err);
    localStorage.removeItem("token");
    user.value = null;
  }
}

onMounted(() => {
  fetchUserData();
});

</script>

<template>
  <div>
    <Login v-if="!user" @login-success="fetchUserData" />
    <div v-else>
        <Mobile :userData="user"
        />
    </div>
  </div>
</template>
