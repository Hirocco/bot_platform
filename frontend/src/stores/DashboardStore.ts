// src/stores/DashboardStore.ts
import { defineStore } from 'pinia'
import { Mt5DashboardWs } from '@/api/DashboardWs'

export type DashboardAccount = {
  login: number
  name: string
  balance: number
  equity: number
  margin_level: number
  leverage: number
  currency: string
  margin: number
  free_margin: number
}

export type DashboardPosition = {
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

export type DashboardSnapshotPayload = {
  timestamp: string
  account: DashboardAccount
  positions: DashboardPosition[]
  terminal_info: string
}

type DashboardSnapshotMessage = {
  type: 'dashboard_snapshot'
  payload: DashboardSnapshotPayload
  status?: string
}

type DashboardErrorMessage = {
  type: 'error'
  code: string
  message?: string
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSnapshotMessage(value: unknown): value is DashboardSnapshotMessage {
  if (!isObject(value)) return false
  if (value.type !== 'dashboard_snapshot') return false
  if (!isObject(value.payload)) return false
  return 'account' in value.payload && 'positions' in value.payload
}

function isErrorMessage(value: unknown): value is DashboardErrorMessage {
  if (!isObject(value)) return false
  return value.type === 'error' && typeof value.code === 'string'
}

const wsClient = new Mt5DashboardWs('ws://127.0.0.1:8000/ws/mt5/dashboard')

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    account: null as DashboardAccount | null,
    positions: [] as DashboardPosition[],
    terminalInfo: null as string | null,
    lastUpdate: null as string | null,

    wsConnected: false,
    error: null as string | null,
  }),

  getters: {
    hasData: (state) => !!state.account,
    openPositionsCount: (state) => state.positions.length,
  },

  actions: {
    connectWs() {
      if (this.wsConnected) return

      console.log('[STORE] Connecting WebSocket...')

      wsClient.connect(
        (data) => {
          console.log('[STORE] Received data from WS')
          this.handleMessage(data)
        },
        (err) => {
          console.error('[STORE] WS error in store:', err)
          this.error = 'WebSocket error'
          this.wsConnected = false
        },
      )

      this.wsConnected = true
      console.log('[STORE] WebSocket connected flag set')
    },

    disconnectWs() {
      wsClient.close()
      this.wsConnected = false
    },

    handleMessage(raw: unknown) {
      console.log('[STORE] raw message to handle:', raw)

      if (isSnapshotMessage(raw)) {
        const payload = (raw as DashboardSnapshotMessage).payload
        console.log('[STORE] snapshot payload:', payload)

        this.account = payload.account
        this.positions = payload.positions ?? []
        this.terminalInfo = payload.terminal_info ?? null
        this.lastUpdate = payload.timestamp
        this.error = null

        console.log('[STORE] account updated:', this.account)
        console.log('[STORE] positions count:', this.positions.length)
        return
      }

      if (isErrorMessage(raw)) {
        const err = raw as DashboardErrorMessage
        this.error = err.message || err.code || 'Unknown WS error'
        console.error('[STORE] Dashboard WS error:', err)
        return
      }

      console.warn('[STORE] Unknown WS message format:', raw)
    },
  },
})
