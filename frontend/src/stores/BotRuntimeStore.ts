// src/stores/botRuntimeStore.ts
import { defineStore } from 'pinia'

export interface BotRuntimeMetrics {
  start_ts: string | null
  loop_ticks: number
  trades_opened: number
  last_signal_ts: string | null
  last_trade_ts: string | null
}

export interface BotRuntimeCfg {
  symbols: string[]
  mode: string
  params_csv: string
  n_bars: number
  loop_sleep_s: number
  risk: number
  rr: number
  be_thresh: number
  be_buffer_pips: number
}

export interface BotRuntimeState {
  state: string // "DISCONNECTED" | "IDLE" | "RUNNING" itd.
  is_connected: boolean
  is_trading: boolean
  last_error: string | null
  metrics: BotRuntimeMetrics
  cfg: BotRuntimeCfg
}

export const useBotRuntimeStore = defineStore('botRuntime', {
  state: () => ({
    runtime: null as BotRuntimeState | null,
  }),
  actions: {
    setRuntime(runtime: BotRuntimeState) {
      this.runtime = runtime
    },
  },
})
