<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { label: 'Dashboard', name: 'dashboard' },
  { label: 'Strategies', name: 'strategies' },
  { label: 'Parameters', name: 'parameters' },
  { label: 'Settings', name: 'settings' },
]

const currentTab = computed<string>({
  get: () => (route.name as string) || 'dashboard',
  set: (val: string) => {
    if (val && val !== route.name) {
      router.push({ name: val })
    }
  },
})
</script>

<template>
  <!-- zamiast <header> używamy v-sheet, ale z tymi samymi klasami co w index.html -->
  <v-sheet
    class="header px-8 py-4 d-flex align-center justify-space-between"
    color="transparent"
    elevation="0"
  >
    <div class="header-left">
      <!-- Ikonka jak w screenie -->
      <v-icon size="26" class="mr-3">mdi-finance</v-icon>

      <!-- Tytuł z istniejącą klasą -->
      <h1 class="dashboard-title">TFX - Trading systems</h1>

      <!-- LIVE badge skopiowany ze stylu index.html -->
      <div class="live-badge ml-4">
        <span class="live-dot"></span>
        LIVE
      </div>
    </div>

    <!-- Nawigacja po zakładkach (Dashboard / Strategies / Parameters / Settings) -->
    <v-tabs v-model="currentTab" align-tabs="end" density="comfortable" class="dashboard-tabs">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :value="tab.name"
        class="text-body-2 text-uppercase"
      >
        {{ tab.label }}
      </v-tab>
    </v-tabs>
  </v-sheet>
</template>

<style scoped>
/* SKOPIOWANE z index.html – dopasowane do komponentu */

.header {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 32px; /* var(--space-xl) */
  flex-wrap: wrap;
  gap: 16px; /* var(--space-md) */
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px; /* var(--space-md) */
}

.dashboard-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

/* LIVE badge */
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px; /* var(--space-xs) */
  padding: 4px 16px; /* xs, md */
  background-color: var(--color-success);
  color: white;
  border-radius: 16px; /* var(--radius-lg) */
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: pulse 2s infinite;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

/* Animacje jak w index.html */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Stylowanie zakładek, żeby przypominały screen */
.dashboard-tabs :deep(.v-tab) {
  min-width: auto;
  padding-inline: 16px;
  text-transform: none;
}

.dashboard-tabs :deep(.v-tab--selected) {
  font-weight: 600;
}

.dashboard-tabs :deep(.v-tabs-slider) {
  height: 2px;
}
</style>
