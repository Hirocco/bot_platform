<!-- src/components/dashboard/DashboardSummaryRow.vue -->
<template>
  <div class="metrics-wrapper">
    <div class="metrics-row">
      <div class="metric-col">
        <MetricCard
          label="ACCOUNT BALANCE"
          :value="props.balance"
          value-mode="currency"
          currency="USD"
          change-mode="currency"
          value-tone="negative"
        />
      </div>

      <div class="metric-col">
        <MetricCard
          label="CURRENT EQUITY"
          :value="props.equity"
          value-mode="currency"
          currency="USD"
          change-mode="currency"
          value-tone="positive"
        />
      </div>

      <div class="metric-col">
        <MetricCard
          label="OPEN POSITIONS"
          :value="props.positions"
          value-mode="number"
          :change="null"
          change-mode="text"
          change-text="Active"
          value-tone="neutral"
        />
      </div>

      <div class="metric-col">
        <MetricCard
          label="Positions P&L"
          :value="props.pnl"
          value-mode="currency"
          currency="USD"
          :change="props.pnl"
          change-mode="percent"
          :value-tone="props.pnl >= 0 ? 'positive' : 'negative'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MetricCard from './DashboardMetricCard.vue'


const props = defineProps({
  balance: { type: Number, required: true },
  equity: { type: Number, required: true },
  positions: { type: Number, required: true },
  pnl: { type: Number, required: true },
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
