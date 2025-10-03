// Client-side WebSocket-like functionality using polling
export class ChatClient {
  private pollInterval: NodeJS.Timeout | null = null
  private lastMessageId = 0
  private onMessageCallback: ((messages: any[]) => void) | null = null

  constructor(private channel = "general") {}

  connect(onMessage: (messages: any[]) => void) {
    this.onMessageCallback = onMessage
    this.startPolling()
  }

  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  private async startPolling() {
    // Initial fetch
    await this.fetchNewMessages()

    // Poll every 2 seconds for new messages
    this.pollInterval = setInterval(async () => {
      await this.fetchNewMessages()
    }, 2000)
  }

  private async fetchNewMessages() {
    try {
      const response = await fetch(`/api/messages?channel=${this.channel}&limit=50`)
      const data = await response.json()

      if (data.messages && this.onMessageCallback) {
        // Filter for new messages only
        const newMessages = data.messages.filter((msg: any) => msg.id > this.lastMessageId)

        if (newMessages.length > 0) {
          this.lastMessageId = Math.max(...data.messages.map((m: any) => m.id))
          this.onMessageCallback(data.messages)
        }
      }
    } catch (error) {
      console.error("[v0] Error polling messages:", error)
    }
  }

  async sendMessage(username: string, content: string) {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content, channel: this.channel }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      throw error
    }
  }
}
