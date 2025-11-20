<template>
  <DashboardLayout>
    <v-container class="dashboard-container pt-12 d-flex flex-column">
      <DashboardHeader />

      <!-- prosty loader + error -->
      <div v-if="isLoading" class="text-center py-4">Ładowanie dashboardu...</div>
      <div v-else-if="error" class="text-center py-4 red--text">
        {{ error }}
      </div>

      <!-- Karty podsumowania -->
      <DashboardSummaryRow
        v-if="account"
        :balance="account.balance"
        :equity="account.equity"
        :positions="positions.length"
        :pnl="calculatedPnl"
      />

      <!-- Wiersz wykresów -->
      <section class="charts-row">
        <DashboardChart
          title="Balance History"
          :labels="balanceLabels"
          :data="balanceValues"
          lineColor="rgba(59,130,246,1)"
        />
        <DashboardChart
          title="Equity History"
          :labels="equityLabels"
          :data="equityValues"
          lineColor="rgba(16,185,129,1)"
        />
      </section>

      <!-- Tabela pozycji -->
      <section class="dashboard-section dashboard-section--bottom">
        <DashboardPositionsTable :positions="tablePositions" />
      </section>

      <!-- Debug: ostatni update -->
      <div class="text-right text-caption mt-2" v-if="lastUpdate">
        Last update: {{ lastUpdate }}
      </div>
    </v-container>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/DashboardStore'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardSummaryRow from '@/components/dashboard/DashboardSummaryRow.vue'
import DashboardChart from '@/components/dashboard/DashboardChart.vue'
import DashboardPositionsTable from '@/components/dashboard/DashboardPositionsTable.vue'

type BackendPosition = {
  ticket: number
  opened_at: string
  updated_at: string
  type: number
  reason: number
  magic: number
  identifier: number
  symbol: string
  volume: number
  price_open: number
  sl: number
  tp: number
  price_current: number
  swap: number
  profit: number
  comment: string | null
}
type TablePosition = {
  ticket: number
  symbol: string
  entry: number
  current: number
  size: number
  pnl: number
  openTime: string
}

// 1) store
const dashboardStore = useDashboardStore()
const { account, positions, lastUpdate, error } = storeToRefs(dashboardStore)

const isLoading = ref(true)

// 2) dane do wykresów (reagują na lastUpdate)
const balanceLabels = ref<string[]>([])
const balanceValues = ref<number[]>([])
const equityLabels = ref<string[]>([])
const equityValues = ref<number[]>([])

// 3) PnL (prosty przykład – z pozycji)
const calculatedPnl = computed(() =>
  positions.value.reduce((sum, p: BackendPosition) => sum + (p.profit ?? 0), 0),
)

// 4) mapowanie pozycji do formatu tabeli

const tablePositions = computed<TablePosition[]>(() =>
  positions.value.map((p: BackendPosition) => ({
    ticket: p.ticket,
    symbol: p.symbol,
    entry: p.price_open,
    current: p.price_current,
    size: p.volume,
    pnl: p.profit,
    openTime: p.opened_at,
  })),
)

// 5) start / stop WebSocketa
onMounted(() => {
  dashboardStore.connectWs()

  // przestajemy pokazywać "Ładowanie..." po pierwszym snapshotcie
  const stop = watch(
    account,
    (acc) => {
      if (acc) {
        isLoading.value = false
        stop()
      }
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  dashboardStore.disconnectWs()
})

// 6) reagowanie na każdy nowy snapshot – aktualizacja serii historycznych
watch(
  lastUpdate,
  (ts) => {
    if (!ts || !account.value) return

    // dodajemy kolejne punkty (immutability -> wymusza rerender Chart.js)
    balanceLabels.value = [...balanceLabels.value, ts]
    balanceValues.value = [...balanceValues.value, account.value.balance]

    equityLabels.value = [...equityLabels.value, ts]
    equityValues.value = [...equityValues.value, account.value.equity]
  },
  { immediate: false },
)
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.dashboard-section--bottom {
  margin-top: 32px;
}
</style>
