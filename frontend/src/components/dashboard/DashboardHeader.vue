<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoSrc from '/tfx-logo-removebg.png'
import { mdiChartLine, mdiViewDashboardOutline, mdiTuneVariant, mdiCogOutline } from '@mdi/js'
import { useBotRuntimeStore } from '@/stores/BotRuntimeStore'
import { storeToRefs } from 'pinia'
import { BotApi } from '@/api/BotApi'

// ROUTING / TABS
const router = useRouter()
const route = useRoute()

const tabs = [
  { label: 'Dashboard', name: 'dashboard', icon: mdiViewDashboardOutline },
  { label: 'Strategies', name: 'strategies', icon: mdiChartLine },
  { label: 'Parameters', name: 'parameters', icon: mdiTuneVariant },
  { label: 'Settings', name: 'settings', icon: mdiCogOutline },
]

const currentTab = ref<string>('dashboard')

onMounted(async () => {
  const name = route.name as string | undefined
  if (name && tabs.some((t) => t.name === name)) {
    currentTab.value = name
  }
})

watch(
  () => route.name,
  (name) => {
    const n = name as string | undefined
    if (n && tabs.some((t) => t.name === n)) {
      currentTab.value = n
    }
  },
)

const handleTabChange = (val: unknown) => {
  if (typeof val !== 'string') return
  currentTab.value = val
  if (val !== route.name) {
    router.push({ name: val }).catch(() => {})
  }
}

// BOT STATE / BUTTONY
const botRuntimeState = useBotRuntimeStore()
const { runtime } = storeToRefs(botRuntimeState)

// computed do LIVE (tekst + klasa)
const liveLabel = computed(() => {
  if (!runtime.value) return 'OFFLINE'

  const r = runtime.value

  if (r.last_error) return 'ERROR'
  if (!r.is_connected) return 'DISCONNECTED'
  if (r.is_connected && !r.is_trading) return 'CONNECTED'
  if (r.is_connected && r.is_trading) return 'TRADING'

  return r.state.toUpperCase()
})


// lokalny stan przycisku (spinner, blokada spamowania)
const isToggleLoading = ref(false)

// czy bot aktualnie handluje (na podstawie statusu z WS)
const isTrading = computed(() => !!runtime.value?.is_trading)

// label przycisku w zależności od stanu
const tradingButtonLabel = computed(() => (isTrading.value ? 'Stop trading' : 'Start trading'))

// kolor przycisku w zależności od stanu
const tradingButtonColor = computed(() => (isTrading.value ? 'red-darken-2' : 'green-accent-4'))

// główna akcja po kliknięciu
const handleToggleTrading = async () => {
  if (isToggleLoading.value) return
  isToggleLoading.value = true
  try {
    if (!isTrading.value) {
      // NIE handluje -> start bota z predefiniowaną konfiguracją
      await BotApi.startBot()
    } else {
      // handluje -> stop
      await BotApi.stopBot()
    }
    // nowy status przyjdzie przez WebSocket i zaktualizuje runtime
  } catch (err) {
    console.error('Toggle trading failed', err)
  } finally {
    isToggleLoading.value = false
  }
}
</script>

<template>
  <header class="header">
    <!-- LEWA STRONA: LOGO + TYTUŁ -->
    <div class="header-left">
      <div class="logo-wrapper">
        <img :src="logoSrc" alt="TFX Logo" class="logo-img" />
      </div>

      <div class="title-block">
        <h1 class="dashboard-title">TFX - Dashboard</h1>
      </div>
    </div>

    <!-- PRAWY GÓRNY BLOK: LIVE | STATE + PRZYCISKI -->
    <div class="header-right">
      <div class="status-chip">
        <span class="live-dot"></span>
        <span class="live-text">LIVE</span>
        <span class="status-separator">|</span>
        <span class="state-text">{{ liveLabel }}</span>
      </div>

      <div class="header-actions">
        <v-btn
          size="small"
          :loading="isToggleLoading"
          :color="tradingButtonColor"
          variant="flat"
          class="mr-4"
          @click="handleToggleTrading"
        >
          {{ tradingButtonLabel }}
        </v-btn>
      </div>
    </div>

    <!-- PASEK NAWIGACJI: TABS -->
    <nav class="header-nav">
      <v-tabs
        v-model="currentTab"
        @update:model-value="handleTabChange"
        align-tabs="end"
        density="comfortable"
        class="dashboard-tabs"
      >
        <v-tab v-for="tab in tabs" :key="tab.name" :value="tab.name" class="dashboard-tab">
          <!-- jeśli masz poprawnie skonfigurowane mdi-svg, to zadziała: -->
          <v-icon :icon="tab.icon" size="18" class="mr-2" />
          <span>{{ tab.label }}</span>
        </v-tab>
      </v-tabs>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  box-sizing: border-box;
  padding: 10px 32px; /* niższy header, dopasowany do guzików */
  display: flex;
  flex-wrap: wrap; /* tabs spadają w drugi rząd */
  align-items: center;
  column-gap: 24px;
  row-gap: 8px;

  background: linear-gradient(
    90deg,
    rgba(9, 12, 23, 1) 0%,
    /* ciemniejsza lewa */ rgba(12, 16, 29, 1) 35%,
    /* smooth transition */ rgba(20, 25, 42, 1) 100% /* jaśniejsza prawa */
  );
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.35),
    /* miękki główny cień */ 0 1px 0 rgba(255, 255, 255, 0.05),
    /* delikatna linia highlightu */ inset 0 -1px 0 rgba(255, 255, 255, 0.04); /* subtelna wewnętrzna linia */
}

/* LEWA STRONA */

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
  height: 44px;
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 8px 18px rgba(15, 23, 42, 0.9));
}

.title-block {
  display: flex;
  align-items: center;
}

.dashboard-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #f9fafb;
}

/* PRAWY GÓRNY BLOK: STATUS + BUTTONY */

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* LIVE ● | STATE */

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.35);
  backdrop-filter: blur(10px);
}

.live-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #22c55e;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.9);
  animation: liveBlink 1.4s infinite;
}

.live-text {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #e5e7eb;
}

.status-separator {
  font-size: 12px;
  opacity: 0.5;
}

.state-text {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #38bdf8;
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

/* PRZYCISKI */

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-reconnect {
  text-transform: none;
  font-size: 13px;
  border-radius: 999px;
  border-color: rgba(148, 163, 184, 0.6) !important;
}

.btn-trading {
  text-transform: none;
  font-size: 13px;
  border-radius: 999px;
  padding-inline: 18px;
}

/* TABS */

.header-nav {
  grid-area: nav;
  margin-left: 10vw;
}

.dashboard-tabs {
  max-width: 100%;
}

/* kolory dopasowane do makiety */

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

.dashboard-tabs :deep(.v-tab--selected) {
  color: #f9fafb !important;
  font-weight: 600;
}

.dashboard-tabs :deep(.v-tab .v-icon) {
  opacity: 0.7;
  transition: opacity 0.18s ease;
}

.dashboard-tabs :deep(.v-tab--selected .v-icon) {
  opacity: 1;
}

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

/* MOBILE */

@media (max-width: 960px) {
  .header {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'left'
      'right'
      'nav';
    padding: 12px 16px;
    row-gap: 8px;
  }

  .header-right {
    justify-content: space-between;
  }

  .header-actions {
    gap: 8px;
  }

  .dashboard-tabs :deep(.v-tab) {
    padding-inline: 10px;
    font-size: 13px;
  }

  .dashboard-title {
    font-size: 20px;
  }
}
</style>
