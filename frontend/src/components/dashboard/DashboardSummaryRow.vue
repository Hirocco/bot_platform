<!-- src/components/dashboard/DashboardSummaryRow.vue -->
<template>
  <div class="metrics-wrapper">
    <div class="metrics-row">
      <div class="metric-col">
        <MetricCard
          label="ACCOUNT BALANCE"
          :value="demoMetrics.balance"
          value-mode="currency"
          currency="USD"
          :change="demoMetrics.balanceChange"
          change-mode="currency"
          value-tone="negative"
        />
      </div>

      <div class="metric-col">
        <MetricCard
          label="CURRENT EQUITY"
          :value="demoMetrics.equity"
          value-mode="currency"
          currency="USD"
          :change="demoMetrics.equityChange"
          change-mode="currency"
          value-tone="positive"
        />
      </div>

      <div class="metric-col">
        <MetricCard
          label="OPEN POSITIONS"
          :value="demoMetrics.openPositions"
          value-mode="number"
          :change="null"
          change-mode="text"
          change-text="Active"
          value-tone="neutral"
        />
      </div>

      <div class="metric-col">
        <MetricCard
          label="DAILY P&L"
          :value="demoMetrics.dailyPnl"
          value-mode="currency"
          currency="USD"
          :change="demoMetrics.dailyPnlChangePercent"
          change-mode="percent"
          value-tone="positive"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import MetricCard from './DashboardMetricCard.vue'

const demoMetrics = reactive({
  balance: 10549.87,
  balanceChange: -6.52,
  equity: 10708.18,
  equityChange: 6.09,
  openPositions: 3,
  dailyPnl: 209.51,
  dailyPnlChangePercent: 2.0,
})
</script>
<style scoped>
.metrics-wrapper {
  margin-top: 10vh;
  width: 100%;
}

/* Rząd kart – pełna szerokość kontenera */
.metrics-row {
  display: flex;
  flex-wrap: nowrap; /* na desktopie 4 karty w jednym rzędzie */
  justify-content: space-between;
  width: 100%;
  column-gap: 24px; /* odstęp między kartami – możesz zmniejszyć/zwiększyć */
}

/* Pojedyncza kolumna – każda bierze 1/4 szerokości */
.metric-col {
  flex: 1 1 0;
  display: flex;
}

/* Upewniamy się, że karta wypełnia kolumnę */
.metric-col :deep(.metric-card) {
  width: 100%;
}

/* RESPONSYWNOŚĆ: poniżej 1200px łamie na 2x2 */
@media (max-width: 1200px) {
  .metrics-row {
    flex-wrap: wrap;
    row-gap: 24px;
  }

  .metric-col {
    flex: 0 0 calc(50% - 12px);
  }
}

/* Poniżej 700px – jedna karta w rzędzie */
@media (max-width: 700px) {
  .metric-col {
    flex: 0 0 100%;
  }
}
</style>
