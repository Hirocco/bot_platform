<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LoginLayout from '@/layouts/LoginLayout.vue'

const route = useRoute()
const layoutComponent = computed(() => {
  // Możesz dodać więcej warunków dla różnych layoutów
  if (route.path === '/login') {
    return LoginLayout
  }
  return 'div' // Domyślny layout
})
</script>
