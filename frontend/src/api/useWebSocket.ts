// src/composables/useWebSocket.ts
import { ref } from 'vue'

interface UseWebSocketOptions {
  url: string
  onMessage?: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
}

export function useWebSocket(options: UseWebSocketOptions) {
  let ws: WebSocket | null = null
  const isConnected = ref(false)

  const connect = () => {
    try {
      ws = new WebSocket(options.url)

      ws.onopen = () => {
        isConnected.value = true
        options.onOpen?.()
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        options.onMessage?.(data)
      }

      ws.onerror = (error) => {
        options.onError?.(error)
      }

      ws.onclose = () => {
        isConnected.value = false
        options.onClose?.()
        // Auto-reconnect after 3s
        setTimeout(connect, 3000)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }

  const send = (data: unknown) => {
    if (ws && isConnected.value) {
      ws.send(JSON.stringify(data))
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
  }

  return {
    connect,
    send,
    disconnect,
    isConnected,
  }
}
