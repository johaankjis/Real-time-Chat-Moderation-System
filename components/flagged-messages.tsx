"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Trash2, CheckCircle } from "lucide-react"

interface FlaggedMessage {
  id: number
  username: string
  content: string
  toxicity_score: number
  flag_type: string
  confidence_score: number
  details: any
  created_at: string
}

export function FlaggedMessages() {
  const [messages, setMessages] = useState<FlaggedMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlaggedMessages()
    const interval = setInterval(fetchFlaggedMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchFlaggedMessages() {
    try {
      const response = await fetch("/api/messages/flagged")
      const data = await response.json()
      setMessages(data.flaggedMessages || [])
    } catch (error) {
      console.error("[v0] Error fetching flagged messages:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(messageId: number) {
    try {
      await fetch("/api/moderation/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, moderatorId: 1, reason: "Toxic content removed" }),
      })
      fetchFlaggedMessages()
    } catch (error) {
      console.error("[v0] Error deleting message:", error)
    }
  }

  function getSeverityColor(score: number) {
    if (score >= 0.8) return "bg-red-500/10 text-red-400 border-red-500/20"
    if (score >= 0.6) return "bg-orange-500/10 text-orange-400 border-orange-500/20"
    if (score >= 0.3) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    return "bg-blue-500/10 text-blue-400 border-blue-500/20"
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h2 className="font-semibold text-lg text-zinc-50">Flagged Messages</h2>
          <Badge variant="secondary" className="ml-auto bg-amber-500/10 text-amber-400">
            {messages.length} pending
          </Badge>
        </div>
      </div>

      <div className="max-h-[600px] space-y-4 overflow-y-auto p-6">
        {loading ? (
          <p className="text-center text-sm text-zinc-500">Loading...</p>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500/50" />
            <p className="mt-4 text-sm text-zinc-400">No flagged messages</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-zinc-300">{message.username}</span>
                    <Badge className={getSeverityColor(message.toxicity_score)}>
                      {(message.toxicity_score * 100).toFixed(0)}% toxic
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{message.content}</p>
                  {message.details?.categories && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.details.categories.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="border-zinc-700 text-xs text-zinc-500">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-zinc-600">{new Date(message.created_at).toLocaleString()}</p>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(message.id)} className="shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
