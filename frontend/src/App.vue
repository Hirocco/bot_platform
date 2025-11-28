<template>
  <!-- Widok logowania w osobnym layoutcie -->
  <LoginLayout v-if="route.path === '/login'">
    <router-view />
  </LoginLayout>

  <!-- Cała reszta aplikacji (po zalogowaniu) -->
  <div v-else class="app-shell">
    <DashboardHeader />

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import LoginLayout from '@/layouts/LoginLayout.vue'
import DashboardHeader from './components/dashboard/DashboardHeader.vue'
import { useDashboardStore } from '@/stores/DashboardStore'

const route = useRoute()
const dashboardStore = useDashboardStore()

// 🔹 inicjalizacja dashboardu na wszystkich ścieżkach ≠ /login
watch(
  () => route.path,
  (path) => {
    if (path !== '/login') {
      dashboardStore.init()
    }
  },
  { immediate: true },
)
</script>
