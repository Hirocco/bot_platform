<template>
  <section class="positions-card">
    <header class="positions-header">
      <h2 class="positions-title">Open Positions</h2>
    </header>

    <div class="table-container">
      <table class="positions-table">
        <thead>
          <tr>
            <th>SYMBOL</th>
            <th>SIDE</th>
            <th>ENTRY</th>
            <th>CURRENT</th>
            <th>SIZE</th>
            <th>SL</th>
            <th>TP</th>
            <th>P&amp;L</th>
            <th>STATUS</th>
            <th>OPEN TIME</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pos in paginatedPositions"
            :key="pos.id ?? `${pos.symbol}-${pos.entry}-${pos.openTime}`"
          >
            <td>
              <span class="symbol-pill">
                {{ pos.symbol }}
              </span>
            </td>

            <td class="position-id">
              <span :class="['status-pill', sideClass(pos.direction)]">
                {{ (pos.direction || '—').toUpperCase() }}
              </span>
            </td>

            <td class="numeric">
              {{ formatPrice(pos.entry) }}
            </td>

            <td class="numeric">
              {{ formatPrice(pos.current) }}
            </td>

            <td class="numeric">
              {{ formatSize(pos.size) }}
            </td>

            <td class="numeric">
              {{ formatPrice(pos.sl) }}
            </td>

            <td class="numeric">
              {{ formatPrice(pos.tp) }}
            </td>

            <td :class="['numeric', 'pnl', pnlClass(pos.pnl)]">
              {{ formatPnl(pos.pnl) }}
            </td>

            <td>
              <span :class="['status-pill', statusClass(pos.status)]">
                {{ (pos.status || '').toUpperCase() }}
              </span>
            </td>

            <td class="open-time">
              {{ formatDateTime(pos.openTime) }}
            </td>
          </tr>

          <tr v-if="!positions || positions.length === 0">
            <td colspan="10" class="empty-row">No open positions</td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="pagination-btn icon-btn"
          :disabled="currentPage === 1"
          @click="prevPage"
          aria-label="Previous page"
        >
          <span class="chevron chevron-left">‹</span>
        </button>

        <span class="pagination-info"> {{ currentPage }} / {{ totalPages }} </span>

        <button
          class="pagination-btn icon-btn"
          :disabled="currentPage === totalPages"
          @click="nextPage"
          aria-label="Next page"
        >
          <span class="chevron chevron-right">›</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Position {
  id?: string | number
  symbol: string
  //positionId?: string | number
  direction?: string
  entry: number
  current: number
  size: number
  sl?: number | null
  tp?: number | null
  pnl: number
  status?: string // 'PROFIT' | 'LOSS' | ...
  openTime: string | Date // ISO string lub Date
}

const props = defineProps<{
  positions: Position[]
  currencySymbol?: string
}>()

const currency = computed(() => props.currencySymbol ?? '$')

/* --- PAGING --- */
const pageSize = 5
const currentPage = ref(1)

const totalPages = computed(() =>
  props.positions.length === 0 ? 1 : Math.ceil(props.positions.length / pageSize),
)

const paginatedPositions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return props.positions.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

/* reset strony jeśli zmieni się liczba pozycji */
watch(
  () => props.positions.length,
  () => {
    currentPage.value = 1
  },
)

/* --- FORMATTERY --- */
const formatPrice = (v: number | null | undefined): string => (v == null ? '—' : v.toFixed(6))

const formatSize = (v: number | null | undefined): string => (v == null ? '—' : v.toFixed(2))

const formatPnl = (v: number | null | undefined): string => {
  if (v == null) return '—'
  const sign = v > 0 ? '+' : v < 0 ? '-' : ''
  const abs = Math.abs(v).toFixed(2)
  return `${sign}${currency.value}${abs}`
}

const formatDateTime = (v: string | Date | null | undefined): string => {
  if (!v) return '—'

  // jeżeli string – spróbuj sparsować jako ISO, a jak się nie uda, pokaż surową wartość
  if (typeof v === 'string') {
    // 1) spróbuj JS Date
    const d1 = new Date(v)
    if (!Number.isNaN(d1.getTime())) {
      d1.setHours(d1.getHours() + 1)
      return `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(
        d1.getDate(),
      ).padStart(2, '0')} ${String(d1.getHours()).padStart(2, '0')}:${String(
        d1.getMinutes(),
      ).padStart(2, '0')}:${String(d1.getSeconds()).padStart(2, '0')}`
    }

    // 2) fallback – po prostu przytnij stringa
    return v.replace('T', ' ').slice(0, 19)
  }

  // Date
  const d = v
  if (Number.isNaN(d.getTime())) return '—'

  d.setHours(d.getHours() + 1)

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
    2,
    '0',
  )}:${String(d.getSeconds()).padStart(2, '0')}`
}

const pnlClass = (v: number | null | undefined): string => {
  if (v == null || v === 0) return 'pnl-neutral'
  return v > 0 ? 'pnl-profit' : 'pnl-loss'
}

const statusClass = (status?: string): string => {
  const s = (status || '').toLowerCase()
  if (s === 'profit') return 'status-profit'
  if (s === 'loss') return 'status-loss'
  return 'status-neutral'
}
const sideClass = (direction?: string): string => {
  const d = (direction || '').toLowerCase()
  if (d === 'long') return 'status-profit' // zielony
  if (d === 'short') return 'status-loss' // czerwony
  return 'status-neutral'
}
</script>

<style scoped>
.positions-card {
  margin-top: 32px;
}

.positions-header {
  margin-bottom: 12px;
}

.positions-title {
  font-size: 18px;
  font-weight: 600;
  color: #f9fafb;
}

.table-container {
  background: #111827;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.positions-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* było: fixed */
}

.positions-table thead {
  background: rgba(15, 23, 42, 0.95);
}

.positions-table th {
  padding: 16px 24px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.9);
  text-align: left;
  white-space: nowrap;
}

/* ENTRY, CURRENT, SIZE, SL, TP, P&L */
.positions-table th:nth-child(3),
.positions-table th:nth-child(4),
.positions-table th:nth-child(5),
.positions-table th:nth-child(6),
.positions-table th:nth-child(7),
.positions-table th:nth-child(8) {
  text-align: right !important;
}

.positions-table tbody tr {
  background: rgba(15, 23, 42, 0.85);
  transition:
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.positions-table tbody tr:nth-child(even) {
  background: rgba(15, 23, 42, 0.75);
}

.positions-table tbody tr + tr {
  border-top: 1px solid rgba(31, 41, 55, 0.9);
}

.positions-table td {
  padding: 18px 24px;
  font-size: 14px;
  color: #e5e7eb;
  vertical-align: middle;
  background: transparent;
}

.numeric {
  text-align: right;
  font-family:
    'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
}

.position-id {
  font-size: 12px;
  color: #9ca3af;
  font-family:
    'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
}

.open-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

/* hover */
.positions-table tbody tr:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}

.positions-table tbody tr:hover td {
  background: rgba(31, 41, 55, 0.95);
  transition: background 0.18s ease;
}

.symbol-pill {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: #2563eb;
  color: #f9fafb;
  font-size: 12px;
  font-weight: 600;
}

.pnl {
  font-weight: 600;
}

.pnl-profit {
  color: #22c55e;
}

.pnl-loss {
  color: #ef4444;
}

.pnl-neutral {
  color: #e5e7eb;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-profit {
  background: rgba(22, 163, 74, 0.15);
  color: #4ade80;
}

.status-loss {
  background: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
}

.status-neutral {
  background: rgba(148, 163, 184, 0.2);
  color: #e5e7eb;
}

.empty-row {
  text-align: center;
  color: #9ca3af;
  padding: 32px 16px;
  font-size: 14px;
}

/* PAGINATION */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px; /* większy odstęp między strzałkami a wartością */
  padding: 12px 20px 16px;
  border-top: 1px solid rgba(31, 41, 55, 0.9);
  background: rgba(15, 23, 42, 0.9);

  /* kluczowe: shrink do zawartości + wycentrowanie całego bloku */
  width: max-content;
  margin: 0 auto;
}

.pagination-info {
  font-size: 12px;
  color: #9ca3af;
  min-width: 60px;
  text-align: center; /* ładnie wyśrodkowane 1 / 2 */
}

.pagination-btn {
  border: none;
  background: transparent;
  color: #e5e7eb;
  font-size: 12px;
  padding: 0;
  cursor: pointer;
}

/* okrągły przycisk z ikoną */
.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center; /* CENTRUM ikony w kole */
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.9);
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    transform 0.12s ease,
    box-shadow 0.16s ease;
}

.icon-btn .chevron {
  display: block;
  font-size: 16px;
  line-height: 1;
}

/* lekkie skorygowanie optycznego środka znaków ‹ i › */
.icon-btn .chevron-left {
  transform: translateX(0.5px);
}

.icon-btn .chevron-right {
  transform: translateX(-0.5px);
}

.icon-btn:hover:not(:disabled) {
  background: rgba(37, 99, 235, 0.18);
  border-color: rgba(37, 99, 235, 0.8);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.6);
  transform: translateY(-0.5px);
}

.icon-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.9);
}

.icon-btn:disabled {
  opacity: 0.35;
  cursor: default;
  border-color: rgba(55, 65, 81, 0.7);
  background: rgba(17, 24, 39, 0.9);
}
</style>
