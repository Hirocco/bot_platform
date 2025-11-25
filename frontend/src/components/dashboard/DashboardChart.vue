<template>
  <div class="chart-card">
    <h3 class="chart-title">{{ title }}</h3>

    <div class="chart-container">
      <canvas ref="canvasEl"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, type PropType } from 'vue'
import { Chart, type TooltipItem } from 'chart.js/auto'

const props = defineProps({
  title: { type: String, required: true },
  labels: { type: Array as PropType<string[]>, required: true },
  data: { type: Array as PropType<number[]>, required: true },
  lineColor: { type: String, default: 'rgba(59,130,246,1)' },
})

const canvasEl = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart<'line', number[], unknown> | null = null

const createGradient = (ctx: CanvasRenderingContext2D, rgbString: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
  gradient.addColorStop(0, `${rgbString.replace('1)', '0.25)')}`)
  gradient.addColorStop(1, `${rgbString.replace('1)', '0.0)')}`)
  return gradient
}

// Create chart ONCE on mount
const createChart = () => {
  if (!canvasEl.value || chartInstance) return

  const ctx = canvasEl.value.getContext('2d')
  if (!ctx) return
  const gradient = createGradient(ctx, props.lineColor)

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          borderColor: props.lineColor,
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(15,23,42,0.95)',
          titleColor: '#f9fafb',
          bodyColor: '#e5e7eb',
          borderColor: 'rgba(148,163,184,0.4)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title(tooltipItems: TooltipItem<'line'>[]) {
              const item = tooltipItems?.[0]
              return item?.label ?? ''
            },
            label(ctx) {
              const v = ctx.parsed.y
              if (v == null || Number.isNaN(v)) return ''
              return `$${v.toFixed(2)}`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(148,163,184,0.7)',
          },
        },
        y: {
          grid: {
            color: 'rgba(148,163,184,0.12)',
          },
          ticks: {
            color: 'rgba(148,163,184,0.7)',
            callback(value) {
              return `$${value}`
            },
          },
        },
      },
    },
  })
}

// Update existing chart data (no recreation)
const updateChart = () => {
  if (!chartInstance) return

  const labels = chartInstance.data.labels as string[]
  const dataset = chartInstance.data.datasets[0]
  if (!dataset) return
  const data = dataset.data as number[]

  // Sync chart data with props
  // Clear and repopulate (more reliable than direct assignment)
  labels.length = 0
  data.length = 0

  labels.push(...props.labels)
  data.push(...props.data)

  // Update with no animation for instant refresh
  chartInstance.update('none')
}

onMounted(() => {
  createChart()
  // Initial update to populate chart with any existing data
  if (props.labels.length > 0) {
    updateChart()
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Watch array lengths to detect new data
watch(
  () => props.labels.length,
  () => {
    updateChart()
  },
)
// Lekki update tylko bieżącego punktu (jak ruch ceny w trakcie świecy)
watch(
  () => props.data[props.data.length - 1],
  (newVal) => {
    if (!chartInstance) return
    if (!props.data.length) return

    const dataset = chartInstance.data.datasets[0]
    if (!dataset) return
    const data = dataset.data as number[]
    const lastIdx = data.length - 1
    if (lastIdx < 0) return
    if (newVal == null || Number.isNaN(newVal)) return

    data[lastIdx] = newVal
    chartInstance.update('none')
  },
)

</script>

<style scoped>
.chart-card {
  display: block;
  border-radius: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.chart-container {
  position: relative;
  height: 300px;
}
.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f3f4f6;
}
</style>
