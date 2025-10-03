"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

interface Message {
  id: number
  username: string
  content: string
  toxicity_score: number
  is_flagged: boolean
  created_at: string
}

export function LiveMessageFeed() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMessages() {
    try {
      const response = await fetch("/api/messages?limit=20")
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    }
  }

  function getToxicityColor(score: number) {
    if (score >= 0.6) return "text-red-400"
    if (score >= 0.3) return "text-yellow-400"
    return "text-emerald-400"
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 p-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          <h2 className="font-semibold text-lg text-zinc-50">Live Message Feed</h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-500">Auto-refresh</span>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] space-y-3 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">No messages yet</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-zinc-300">{message.username}</span>
                    {message.is_flagged && (
                      <Badge variant="destructive" className="text-xs">
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{message.content}</p>
                </div>
                <span className={`text-xs font-medium ${getToxicityColor(message.toxicity_score)}`}>
                  {(message.toxicity_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
