<template>
  <DashboardLayout>
    <v-container class="dashboard-container pt-12 d-flex flex-column">
      <DashboardHeader />

      <div v-if="isLoading" class="text-center py-4">Ładowanie dashboardu...</div>
      <div v-else-if="error" class="text-center py-4 red--text">
        {{ error }}
      </div>

      <DashboardSummaryRow
        v-if="account"
        :balance="account.balance"
        :equity="account.equity"
        :positions="positions.length"
        :pnl="calculatedPnl"
      />

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

      <section class="dashboard-section dashboard-section--bottom">
        <DashboardPositionsTable :positions="tablePositions" />
      </section>

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

const dashboardStore = useDashboardStore()
const { account, positions, lastUpdate, error } = storeToRefs(dashboardStore)

const isLoading = ref(true)

// Chart data arrays (will be mutated, not replaced)
const balanceLabels = ref<string[]>([])
const balanceValues = ref<number[]>([])
const equityLabels = ref<string[]>([])
const equityValues = ref<number[]>([])

// 🔹 Łączny PnL z aktualnie otwartych pozycji (w $)
const dailyPnl = computed(() =>
  positions.value.reduce(
    (sum, p: BackendPosition) => sum + (p.profit ?? 0),
    0,
  ),
)

// 🔹 Procentowy PnL względem bieżącego balansu konta
//     np. -50$ przy balance 80_000$ => -0.0625%
const calculatedPnl = computed(() => {
  if (!account.value || account.value.balance === 0) return 0
  return (dailyPnl.value / account.value.balance) * 100
})


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

onMounted(() => {
  dashboardStore.connectWs()

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

// Track last timestamp to prevent duplicate processing
let lastProcessedTimestamp = ''
let lastMinuteLabel = ''

// Helper to get minute-level timestamp (e.g., "2024-11-25T17:31:00")
const getMinuteTimestamp = (fullTimestamp: string): string => {
  // Parse the timestamp and truncate to minute precision
  const date = new Date(fullTimestamp)
  date.setSeconds(0, 0) // Zero out seconds and milliseconds
  return date.toISOString().slice(0, 16).replace('T', ' ') // "YYYY-MM-DD HH:MM"
}

watch(
  lastUpdate,
  (ts) => {
    if (!ts || !account.value) return

    // Prevent duplicate processing (WebSocket might send same timestamp)
    if (ts === lastProcessedTimestamp) return
    lastProcessedTimestamp = ts

    // Get minute-level timestamp for X-axis label
    const minuteLabel = getMinuteTimestamp(ts)

    // Only add new point when minute changes (or first point)
    const isNewMinute = minuteLabel !== lastMinuteLabel || balanceLabels.value.length === 0

    if (isNewMinute) {
      lastMinuteLabel = minuteLabel

      // Add new data point with minute-level label
      balanceLabels.value.push(minuteLabel)
      balanceValues.value.push(account.value.balance)

      equityLabels.value.push(minuteLabel)
      equityValues.value.push(account.value.equity)
    } else {
      // Same minute - just update the last value (overwrite latest point)
      const lastIdx = balanceValues.value.length - 1
      if (lastIdx >= 0) {
        balanceValues.value[lastIdx] = account.value.balance
        equityValues.value[lastIdx] = account.value.equity
      }
    }

    // Optional: Limit history to prevent unbounded memory growth
    const MAX_POINTS = 1000
    if (balanceLabels.value.length > MAX_POINTS) {
      balanceLabels.value.shift()
      balanceValues.value.shift()
      equityLabels.value.shift()
      equityValues.value.shift()
    }
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
