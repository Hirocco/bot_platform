<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoSrc from '/tfx-logo-removebg.png'

import { mdiViewDashboardOutline, mdiChartLine, mdiTuneVariant, mdiCogOutline } from '@mdi/js'

const router = useRouter()
const route = useRoute()

const tabs = [
  { label: 'Dashboard', name: 'dashboard', icon: mdiViewDashboardOutline },
  { label: 'Strategies', name: 'strategies', icon: mdiChartLine },
  { label: 'Parameters', name: 'parameters', icon: mdiTuneVariant },
  { label: 'Settings', name: 'settings', icon: mdiCogOutline },
]

// lokalny stan zakładki – żeby VTabs ZAWSZE reagował, nawet jak route nie zmienia się poprawnie
const currentTab = ref<string>('dashboard')

// przy starcie dopasuj do aktualnej trasy (jeśli jest na liście)
onMounted(() => {
  const name = route.name as string | undefined
  if (name && tabs.some((t) => t.name === name)) {
    currentTab.value = name
  }
})

// aktualizuj zakładkę, gdy zmieni się route (np. z zewnątrz)
watch(
  () => route.name,
  (name) => {
    const n = name as string | undefined
    if (n && tabs.some((t) => t.name === n)) {
      currentTab.value = n
    }
  },
)

// na kliknięcie w zakładkę – zmień trasę
// handler wywoływany przez @update:model-value w szablonie
const handleTabChange = (val: unknown) => {
  const s = val as string | undefined
  if (s && s !== currentTab.value) {
    currentTab.value = s
  }
}

watch(currentTab, (val) => {
  if (val && val !== route.name) {
    router.push({ name: val }).catch(() => {})
  }
})
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        <img :src="logoSrc" alt="TFX Logo" class="logo-img" />
      </div>

      <div class="title-block">
        <h1 class="dashboard-title">Dashboard</h1>

        <div class="live-indicator">
          <span class="live-dot"></span>
          <span class="live-text">LIVE</span>
        </div>
      </div>
    </div>

    <nav class="header-nav">
      <nav class="header-nav">
        <v-tabs
          v-model="currentTab"
          @update:model-value="handleTabChange"
          align-tabs="end"
          density="comfortable"
          class="dashboard-tabs"
        >
          <v-tab v-for="tab in tabs" :key="tab.name" :value="tab.name" class="dashboard-tab">
            <v-icon :icon="tab.icon" size="18" class="mr-2" />
            <span>{{ tab.label }}</span>
          </v-tab>
        </v-tabs>
      </nav>
    </nav>
  </header>
</template>

<style scoped>
/* ———————————————————————————————————————————————
   HEADER – fixed, kolory jak makieta, box-shadow
   ——————————————————————————————————————————————— */

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  box-sizing: border-box;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: nowrap;

  background: radial-gradient(circle at top left, #1f2937 0, #020617 42%, #000000 100%);
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.85),
    0 0 0 1px rgba(148, 163, 184, 0.07);
}

/* ———————————————————————————————————————————————
   LEWA STRONA: LOGO + TYTUŁ + LIVE
   ——————————————————————————————————————————————— */

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
}

.logo-img {
  height: 100%;
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 8px 18px rgba(15, 23, 42, 0.9));
}

.title-block {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* tytuł dopasowany do makiety: */
.dashboard-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #f9fafb;
}

/* LIVE – jak w makiecie: delikatny, neonowy dot */
.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  opacity: 0.75;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.9);
  animation: liveBlink 1.4s infinite;
}

.live-text {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #cbd5e1;
}

@keyframes liveBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.25;
  }
}

/* ———————————————————————————————————————————————
   PRAWA STRONA: TABS
   ——————————————————————————————————————————————— */

.header-nav {
  margin-left: auto;
  max-width: 100%;
}

/* kontener tabsów: w trybie desktop niech będzie "przyklejony" do prawej */
.dashboard-tabs {
  max-width: 100%;
}

/* podstawowy wygląd zakładek – kolory z makiety */
.dashboard-tabs :deep(.v-tab) {
  text-transform: none;
  padding-inline: 18px;
  font-size: 14px;
  font-weight: 400;
  color: #9ca3af;
  transition:
    color 0.18s ease,
    font-weight 0.18s ease,
    opacity 0.18s ease;
}

.dashboard-tabs :deep(.v-tab:hover) {
  color: #e5e7eb;
}

/* aktywna zakładka – biała, pogrubiona */
.dashboard-tabs :deep(.v-tab--selected) {
  color: #f9fafb !important;
  font-weight: 600;
}

/* ikony – mniej/więcej krycia w zależności od stanu */
.dashboard-tabs :deep(.v-tab .v-icon) {
  opacity: 0.7;
  transition: opacity 0.18s ease;
}

.dashboard-tabs :deep(.v-tab--selected .v-icon) {
  opacity: 1;
}

/* slider (podkreślenie) – dopasowany kolorystycznie + SLIDE animacja */
.dashboard-tabs :deep(.v-tabs-slider) {
  background: linear-gradient(90deg, #38bdf8, #6366f1);
  height: 3px;
  border-radius: 999px;
  transition:
    width 0.22s ease,
    left 0.22s ease,
    right 0.22s ease,
    transform 0.22s ease;
}

/* dodatkowy efekt slide na zmianę zakładki – lekkie przesunięcie */
.dashboard-tabs :deep(.v-slide-group__content) {
  transition: transform 0.22s ease;
}

/* ———————————————————————————————————————————————
   TRYB MOBILNY
   ——————————————————————————————————————————————— */

@media (max-width: 960px) {
  .header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-left {
    width: 100%;
  }

  .header-nav {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
  }

  .dashboard-tabs {
    width: 100%;
  }

  /* tabs przewijalne poziomo na mobile, jak w nowoczesnych UI */
  .dashboard-tabs :deep(.v-slide-group__container) {
    min-width: 100%;
  }

  .dashboard-tabs :deep(.v-slide-group__content) {
    justify-content: space-between;
  }

  .dashboard-tabs :deep(.v-tab) {
    padding-inline: 10px;
    font-size: 13px;
  }

  .title-block {
    gap: 10px;
  }

  .dashboard-title {
    font-size: 20px;
  }

  .live-indicator {
    display: none; /* opcjonalnie ukryj LIVE na wąskich ekranach */
  }
}

@media (max-width: 640px) {
  /* jeszcze ciaśniej – ikony ważniejsze niż tekst */
  .dashboard-tabs :deep(.v-tab span:last-child) {
    font-size: 12px;
  }
}
</style>
