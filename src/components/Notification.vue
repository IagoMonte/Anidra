<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['update:modelValue', 'closed'])

const visible = ref(props.modelValue)
let timer = null

function close() {
  visible.value = false
  emit('update:modelValue', false)
  emit('closed')
  clearTimer()
}

function startTimer() {
  clearTimer()
  if (props.duration > 0) {
    timer = setTimeout(() => close(), props.duration)
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

watch(() => props.modelValue, val => {
  visible.value = val
  if (val) startTimer()
  else clearTimer()
})

onMounted(() => {
  if (visible.value) startTimer()
})

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<template>
  <div class="fixed top-5 right-5 z-50 flex justify-end px-4 pointer-events-none">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-show="visible"
        class="pointer-events-auto w-full max-w-xs border border-gray-600 rounded-lg bg-[#121212] p-3"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-center gap-2">
          <span class="flex-1 text-sm text-white">{{ message }}</span>
          <button
            type="button"
            class="rounded-md p-1.5 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label="Fechar"
            @click="close"
          >×</button>
        </div>
      </div>
    </transition>
  </div>
</template>
