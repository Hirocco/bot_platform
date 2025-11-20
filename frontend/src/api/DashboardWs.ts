// src/api/DashboardWs.ts

export class Mt5DashboardWs {
  private socket: WebSocket | null = null

  constructor(private url: string) {}

  connect(onMessage: (data: unknown) => void, onError?: (err: unknown) => void) {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log('[WS] connection established:', this.url)
    }

    this.socket.onmessage = (event) => {
      console.log('[WS] raw message:', event.data)
      try {
        const data = JSON.parse(event.data)
        console.log('[WS] parsed message:', data)
        onMessage(data)
      } catch (e) {
        console.error('[WS] JSON parse error:', e)
      }
    }

    this.socket.onerror = (event) => {
      console.error('[WS] error:', event)
      if (onError) onError(event)
    }

    this.socket.onclose = () => {
      console.log('[WS] closed')
    }
  }

  close() {
    this.socket?.close()
    this.socket = null
  }
}
