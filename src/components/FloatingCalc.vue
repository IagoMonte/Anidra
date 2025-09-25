<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showCalc = ref(false)

// posição absoluta (em px)
const posX = ref(window.innerWidth - 100)
const posY = ref(window.innerHeight - 100)
const dragging = ref(false)
const offset = { x: 0, y: 0 }

const BUTTON_SIZE = 64
const dragThreshold = 10 // px para diferenciar arraste
const holdDelay = 150 // tempo mínimo (ms) para considerar arraste no touch

// dados do toque
let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0
let moved = false
let holdTimer = null

function startDrag(e) {
  if (showCalc.value) return

  e.preventDefault() // FIX: Previne zoom/scroll inicial no touch

  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY

  if (e.type.includes('touch') && e.touches.length > 1) return // FIX: Ignora multi-touch

  if (e.type.includes('touch')) {
    // salvar dados iniciais
    touchStartX = clientX
    touchStartY = clientY
    touchStartTime = Date.now()
    moved = false

    // timer para liberar arraste só depois do holdDelay
    holdTimer = setTimeout(() => {
      dragging.value = true
      offset.x = clientX - posX.value
      offset.y = clientY - posY.value
    }, holdDelay)
  } else {
    // mouse → arraste imediato
    dragging.value = true
    offset.x = clientX - posX.value
    offset.y = clientY - posY.value
  }
}

function onDrag(e) {
  if (!dragging.value) return
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY

  if (e.type.includes('touch')) {
    const dx = Math.abs(clientX - touchStartX)
    const dy = Math.abs(clientY - touchStartY)
    if (dx > dragThreshold || dy > dragThreshold) moved = true
  }

  let newX = clientX - offset.x
  let newY = clientY - offset.y

  // limites
  if (newX < 0) newX = 0
  if (newX > window.innerWidth - BUTTON_SIZE) newX = window.innerWidth - BUTTON_SIZE
  if (newY < 0) newY = 0
  if (newY > window.innerHeight - BUTTON_SIZE) newY = window.innerHeight - BUTTON_SIZE

  posX.value = newX
  posY.value = newY
}

function stopDrag(e) {
  clearTimeout(holdTimer)

  if (e.type.includes('touch')) {
    const elapsed = Date.now() - touchStartTime
    // se toque foi rápido e não houve movimento → clique
    if (elapsed < holdDelay && !moved) {
      toggleCalc()
    }
  }

  dragging.value = false
}

function toggleCalc() {
  showCalc.value = !showCalc.value
}

onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
})

/* --- Lógica da calculadora --- */
const display = ref('0')
const current = ref('')
const operator = ref(null)
const previous = ref(null)

function append(num) {
  if (current.value === '0') current.value = ''
  current.value += num
  display.value = current.value
}

function setOperator(op) {
  if (current.value === '') return
  if (previous.value !== null) calculate()
  operator.value = op
  previous.value = current.value
  current.value = ''
}
function backspace() {
  if (current.value === '' || current.value === '0') return // Nada a apagar
  current.value = current.value.slice(0, -1) // Remove último caractere
  display.value = current.value || '0' // Se vazio, mostra '0'
}


function calculate() {
  if (previous.value === null || current.value === '' || operator.value === null) return
  const prev = parseFloat(previous.value)
  const curr = parseFloat(current.value)
  let result = 0
  switch (operator.value) {
    case '+': result = prev + curr; break
    case '-': result = prev - curr; break
    case '*': result = prev * curr; break
    case '/': result = curr !== 0 ? prev / curr : 'Erro'; break
  }
  display.value = result.toString()
  previous.value = null
  current.value = result.toString()
  operator.value = null
}

function clearAll() {
  display.value = '0'
  current.value = ''
  previous.value = null
  operator.value = null
}
</script>

<template>
  <!-- Botão arrastável -->
  <button
    @click="toggleCalc"
    @mousedown="startDrag"
    @touchstart="startDrag"
    class="fixed z-50 bg-[#121212] text-white font-bold rounded-full hover:glow-border border border-gray-600 shadow-lg cursor-pointer select-none transition duration-200"
    :style="{ top: posY + 'px', left: posX + 'px', width: BUTTON_SIZE + 'px', height: BUTTON_SIZE + 'px' }"
  >
    =
  </button>

  <!-- Calculadora fixa no rodapé -->
  <div
    v-if="showCalc"
    class="fixed bottom-0 left-0 right-0 z-40 bg-[#121212] text-white border-t border-gray-600 shadow-xl p-3"
  >
    <div class="bg-[#1e1e1e] border border-gray-600 rounded-md p-3 mb-4 text-right text-xl font-light ring-2 ring-yellow-500">
      {{ display }}
    </div>

    <div class="grid grid-cols-4 gap-3">

      <button @click="clearAll" class="bg-gray-700 text-gray-300 hover:text-white rounded-md p-3 border border-gray-600">Clear</button>
      <button @click="backspace" class="bg-gray-700 text-gray-300 hover:text-white rounded-md p-3 border border-gray-600">⌫</button>
      
      <button @click="setOperator('/')" class="bg-gray-700 text-gray-300 hover:text-white rounded-md p-3 border border-gray-600">/</button>
      <button @click="setOperator('*')" class="bg-gray-700 text-gray-300 hover:text-white rounded-md p-3 border border-gray-600">×</button>

      <button v-for="n in [7,8,9]" :key="n" @click="append(n)" class="bg-gray-800 text-white hover:text-gray-200 rounded-md p-3 border border-gray-600">{{ n }}</button>
      <button @click="setOperator('-')" class="bg-gray-700 text-gray-300 hover:text-white rounded-md p-3 border border-gray-600">-</button>

      <button v-for="n in [4,5,6]" :key="n" @click="append(n)" class="bg-gray-800 text-white hover:text-gray-200 rounded-md p-3 border border-gray-600">{{ n }}</button>
      <button @click="setOperator('+')" class="bg-gray-700 text-gray-300 hover:text-white rounded-md p-3 border border-gray-600">+</button>

      <button v-for="n in [1,2,3]" :key="n" @click="append(n)" class="bg-gray-800 text-white hover:text-gray-200 rounded-md p-3 border border-gray-600">{{ n }}</button>
      <button @click="calculate" class="row-span-2 bg-yellow-500 text-black hover:bg-yellow-400 font-bold rounded-md p-3 border border-gray-600">=</button>

      <button @click="append(0)" class="col-span-2 bg-gray-800 text-white hover:text-gray-200 rounded-md p-3 border border-gray-600">0</button>
      <button @click="append('.')" class="bg-gray-800 text-white hover:text-gray-200 rounded-md p-3 border border-gray-600">.</button>
    </div>
  </div>
</template>