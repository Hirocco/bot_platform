<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardSummaryRow from '@/components/dashboard/DashboardSummaryRow.vue'
import DashboardChart from '@/components/dashboard/DashboardChart.vue'
import DashboardPositionsTable from '@/components/dashboard/DashboardPositionstable.vue'

const balanceLabels = ref<string[]>(['Jan', 'Feb', 'Mar', 'Apr'])
const balanceValues = ref<number[]>([1000, 1200, 1500, 1300])

const equityLabels = ref<string[]>(['Jan', 'Feb', 'Mar', 'Apr'])
const equityValues = ref<number[]>([900, 1100, 1400, 1250])

const positions = ref([
  {
    symbol: 'EURUSD',
    positionId: 101234,
    entry: 1.0765,
    current: 1.0819,
    size: 0.5,
    sl: 1.07,
    tp: 1.09,
    pnl: 122.44,
    status: 'PROFIT',
    openTime: '2025-11-18T15:42:11Z',
  },
  {
    symbol: 'GBPUSD',
    positionId: 101235,
    entry: 1.265,
    current: 1.2638,
    size: 0.3,
    sl: 1.26,
    tp: 1.275,
    pnl: -36.12,
    status: 'LOSS',
    openTime: '2025-11-18T14:58:19Z',
  },
  {
    symbol: 'XAUUSD',
    positionId: 101236,
    entry: 2425.5,
    current: 2449.9,
    size: 0.1,
    sl: 2410.0,
    tp: 2480.0,
    pnl: 244.0,
    status: 'PROFIT',
    openTime: '2025-11-18T13:12:45Z',
  },
  {
    symbol: 'USDJPY',
    positionId: 101237,
    entry: 151.23,
    current: 151.48,
    size: 1.0,
    sl: 150.8,
    tp: 152.0,
    pnl: 250.0,
    status: 'PROFIT',
    openTime: '2025-11-18T16:03:55Z',
  },
  {
    symbol: 'AUDUSD',
    positionId: 101238,
    entry: 0.6582,
    current: 0.6569,
    size: 0.8,
    sl: 0.655,
    tp: 0.662,
    pnl: -104.0,
    status: 'LOSS',
    openTime: '2025-11-18T11:28:41Z',
  },
  {
    symbol: 'USDCAD',
    positionId: 101239,
    entry: 1.3655,
    current: 1.3688,
    size: 0.4,
    sl: 1.36,
    tp: 1.3725,
    pnl: 132.0,
    status: 'PROFIT',
    openTime: '2025-11-18T12:10:02Z',
  },
  {
    symbol: 'NZDUSD',
    positionId: 101240,
    entry: 0.6051,
    current: 0.604,
    size: 0.6,
    sl: 0.602,
    tp: 0.61,
    pnl: -66.0,
    status: 'LOSS',
    openTime: '2025-11-18T10:17:58Z',
  },
  {
    symbol: 'EURJPY',
    positionId: 101241,
    entry: 162.34,
    current: 162.87,
    size: 0.5,
    sl: 161.9,
    tp: 163.2,
    pnl: 265.0,
    status: 'PROFIT',
    openTime: '2025-11-18T13:49:12Z',
  },
  {
    symbol: 'GBPJPY',
    positionId: 101242,
    entry: 188.45,
    current: 188.12,
    size: 0.3,
    sl: 188.0,
    tp: 189.2,
    pnl: -99.0,
    status: 'LOSS',
    openTime: '2025-11-18T09:33:27Z',
  },
  {
    symbol: 'XAUUSD',
    positionId: 101243,
    entry: 2438.2,
    current: 2443.5,
    size: 0.2,
    sl: 2420.0,
    tp: 2470.0,
    pnl: 106.0,
    status: 'PROFIT',
    openTime: '2025-11-18T16:09:33Z',
  },
])
</script>
<template>
  <DashboardLayout>
    <v-container class="dashboard-container pt-12 d-flex flex-column">
      <DashboardHeader />

      <DashboardSummaryRow />

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
        <DashboardPositionsTable :positions="positions" />
      </section>
    </v-container>
  </DashboardLayout>
</template>

<style scoped>
.dashboard-container {
  background-color: #020617;
  min-height: 100vh;
  min-width: 100%;
}

.charts-row {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  align-items: stretch;
}

/* każdy child (czyli root <div> z DashboardChart) ma dzielić szerokość */
.charts-row > * {
  flex: 1 1 0;
}

/* responsywność – na wąskich ekranach znów jeden pod drugim */
@media (max-width: 1024px) {
  .charts-row {
    flex-direction: column;
  }
}
</style>
