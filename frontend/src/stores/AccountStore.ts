import { defineStore } from 'pinia'
import type { AccountData, CurrentPositionData } from '@/api/AccountApi'
import { AccountApi } from '@/api/AccountApi'

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: null as AccountData | null,
    current_positions: null as CurrentPositionData[] | null,
    isLoading: false,
    error: null as string | null,
    lastFetched: 0,
  }),
  actions: {
    async loadAccount(force = false) {
      // prosta deduplikacja requestów
      const now = Date.now()
      if (!force && this.account && now - this.lastFetched < 1000) {
        // mamy dane <1s temu – nie pobieramy
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const data = await AccountApi.fetchAccountData()
        const posData = await AccountApi.fetchCurrentPositions()
        this.account = data
        this.current_positions = posData
        this.lastFetched = now
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.error = err.message || 'Błąd pobierania danych konta'
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
