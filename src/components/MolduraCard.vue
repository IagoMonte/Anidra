<script setup>
defineProps({
  label: String,
  value: String,
})

const corners = [
  { pos: "top-0 left-0",    rot: "rot-0" },
  { pos: "top-0 right-0",   rot: "rot-90" },
  { pos: "bottom-0 right-0",rot: "rot-180" },
  { pos: "bottom-0 left-0", rot: "rot-270" },
]
</script>

<template>
  <div class="card">
    <span class="text-amber-300 text-sm font-serif tracking-wide">
      {{ label }}
    </span>
    <span class="text-white font-bold font-serif">
      {{ value }}
    </span>

    <!-- Cantos com PNG -->
    <div
      v-for="(c, i) in corners"
      :key="i"
      class="corner absolute w-6 h-6"
      :class="[c.pos, c.rot]"
    >
      <img src="/src/assets/img/image.svg" class="w-full h-full object-contain" />
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: rgba(10, 18, 20, 0.85);
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

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
  0%   { opacity: 0.3; filter: blur(1px); }
  50%  { opacity: 0.8; filter: blur(2px); }
  100% { opacity: 0.3; filter: blur(1px); }
}

.corner {
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(180, 135, 83, 0.849));
}


.rot-0   { transform: rotate(0deg); }
.rot-90  { transform: rotate(90deg); }
.rot-180 { transform: rotate(180deg); }
.rot-270 { transform: rotate(270deg); }

/* puxando levemente pra fora */
.top-0    { top: -3px; }
.right-0  { right: -3px; }
.bottom-0 { bottom: -3px; }
.left-0   { left: -3px; }
</style>
