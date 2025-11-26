<!-- src/components/dashboard/MetricCard.vue -->
<template>
  <!-- Zwykły div – Vuetify jest tu tylko „w tle”, karta ma własne CSS -->
  <div class="metric-card">
    <!-- Górny label, małe szare litery -->
    <div class="metric-label">
      {{ label }}
    </div>

    <!-- Główna wartość, duży monospace (np. $10549.87) -->
    <div :class="['metric-value', valueToneClass]">
      {{ formattedValue }}
    </div>

    <!-- Wiersz z informacją o zmianie / statusem -->
    <div v-if="changeMode !== 'none'" :class="['metric-change', changeToneClass]">
      <!-- Strzałka tylko gdy tryb nie jest tekstowy i mamy liczbę -->
      <span v-if="showArrow">
        {{ arrow }}
      </span>
      <span>
        {{ formattedChange }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ValueMode = 'currency' | 'number'
type ChangeMode = 'currency' | 'percent' | 'text' | 'none'
type Tone = 'neutral' | 'positive' | 'negative'

const props = defineProps<{
  label: string

  // surowa wartość z API (balans, equity, liczba pozycji, PnL)
  value: number

  // sposób formatowania głównej wartości
  valueMode?: ValueMode
  currency?: string

  // surowa zmiana (np. -6.52 dla balansu, 2.0 dla 2%)
  change?: number | null

  // jak interpretować change:
  //  - 'currency' => np. +$6.52
  //  - 'percent'  => np. +2.0%
  //  - 'text'     => ignoruje change i wyświetla changeText (np. "Active")
  //  - 'none'     => w ogóle nie pokazuj dolnego wiersza
  changeMode?: ChangeMode

  // nadpisanie tekstu zmiany przy trybie 'text'
  changeText?: string

  // tonacja koloru głównej wartości (np. czerwony balans, zielony PnL)
  valueTone?: Tone

  // opcjonalne wymuszenie tonacji koloru zmiany
  changeToneOverride?: Tone
}>()

// Domyślne wartości, żeby nie trzeba było za każdym razem wszystkiego podawać
const valueMode = computed<ValueMode>(() => props.valueMode ?? 'currency')
const changeMode = computed<ChangeMode>(() => props.changeMode ?? 'currency')
const currency = computed(() => props.currency ?? 'USD')

// Formatowanie głównej wartości
const formattedValue = computed(() => {
  if (valueMode.value === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.value,
      maximumFractionDigits: 2,
    }).format(props.value)
  }

  // valueMode === 'number'
  return props.value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
})

// Formatowanie dolnej zmiany / statusu
const formattedChange = computed(() => {
  if (changeMode.value === 'none') return ''

  if (changeMode.value === 'text') {
    // np. "Active" pod liczbą pozycji
    return props.changeText ?? ''
  }

  if (props.change == null) return ''

  if (changeMode.value === 'currency') {
    const sign = props.change >= 0 ? '+' : ''
    const val = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.value,
      maximumFractionDigits: 2,
    }).format(Math.abs(props.change))
    return `${sign}${val.replace('$', '')}` // wynik typu +6.52 przy wyświetleniu razem z symbolem waluty
  }

  // changeMode === 'percent'
  const sign = props.change >= 0 ? '+' : ''
  return `${sign}${props.change.toFixed(3)}%`
})

// Czy pokazywać strzałkę ↑ / ↓
const showArrow = computed(() => {
  return changeMode.value !== 'none' && changeMode.value !== 'text' && props.change != null
})

// Znak strzałki na podstawie znaku change
const arrow = computed(() => {
  if (props.change == null) return ''
  return props.change >= 0 ? '↑' : '↓'
})

// Klasa koloru głównej wartości
const valueToneClass = computed(() => {
  const tone: Tone = props.valueTone ?? 'neutral'
  return {
    positive: 'metric-value--positive',
    negative: 'metric-value--negative',
    neutral: '',
  }[tone]
})

// Klasa koloru zmiany (osobno od głównej wartości)
const changeToneClass = computed(() => {
  if (changeMode.value === 'text') {
    // np. "Active" – nie chcemy zielonego/czerwonego, tylko neutralny
    return 'metric-change--neutral'
  }

  const tone: Tone =
    props.changeToneOverride ?? (props.change != null && props.change < 0 ? 'negative' : 'positive')

  return {
    positive: 'metric-change--positive',
    negative: 'metric-change--negative',
    neutral: 'metric-change--neutral',
  }[tone]
})
</script>

<style scoped>
.metric-card {
  width: 100%;
  aspect-ratio: 3.8 / 1; /* wysokość zależy od szerokości */
  background: linear-gradient(135deg, #1e293b 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 22px;
  padding: 18px 22px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}

/* lekki „zoom” i uniesienie na hover – jak na makiecie */
.metric-card:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.65);
}

.metric-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 30px;
  font-weight: 700;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  margin-bottom: 6px;
  color: #e5e7eb;
}

/* zielony / czerwony jak na screenie */
.metric-value--positive {
  color: #22c55e;
}

.metric-value--negative {
  color: #f97373;
}

.metric-change {
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.metric-change--positive {
  color: #22c55e;
}

.metric-change--negative {
  color: #f97373;
}

.metric-change--neutral {
  color: #9ca3af;
}
</style>
<!-- Co tu się dzieje (w skrócie):

Komponent jest głupi – nie zna API, tylko propsy.

value i change są liczbami – idealne pod API.

valueMode określa, czy formatować jako walutę, czy zwykłą liczbę.

changeMode mówi, jak rysować dół: waluta, %, tekst („Active”) albo wcale.

valueTone i changeToneOverride kontrolują kolor (zielony/czerwony/szary).

Hover robi translateY(-2px) scale(1.02) + mocniejszy cień i border. -->
