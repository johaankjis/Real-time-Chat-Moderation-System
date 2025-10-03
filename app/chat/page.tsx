"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare } from "lucide-react"
import { ChatClient } from "@/lib/websocket-client"

interface Message {
  id: number
  username: string
  content: string
  toxicity_score: number
  is_flagged: boolean
  created_at: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const chatClientRef = useRef<ChatClient | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedUsername = localStorage.getItem("chat-username")
    if (savedUsername) {
      setUsername(savedUsername)
      connectToChat(savedUsername)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function connectToChat(user: string) {
    chatClientRef.current = new ChatClient("general")
    chatClientRef.current.connect((newMessages) => {
      setMessages(newMessages)
    })
    setIsConnected(true)
  }

  function handleSetUsername() {
    if (username.trim()) {
      localStorage.setItem("chat-username", username)
      connectToChat(username)
    }
  }

  async function handleSendMessage() {
    if (!message.trim() || !chatClientRef.current) return

    try {
      await chatClientRef.current.sendMessage(username, message)
      setMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 p-8">
          <div className="mb-6 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-blue-400" />
            <h1 className="mt-4 font-semibold text-2xl text-zinc-50">Join Chat</h1>
            <p className="mt-2 text-sm text-zinc-400">Enter your username to start chatting</p>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
              className="border-zinc-700 bg-zinc-950 text-zinc-50"
            />
            <Button onClick={handleSetUsername} className="w-full" disabled={!username.trim()}>
              Join Chat
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              <div>
                <h1 className="font-semibold text-xl text-zinc-50">Chat Room</h1>
                <p className="text-xs text-zinc-500">Logged in as {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-400">Connected</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col px-6 py-6">
        <Card className="flex flex-1 flex-col border-zinc-800 bg-zinc-900/50">
          <div className="flex-1 space-y-3 overflow-y-auto p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-3 ${
                  msg.username === username ? "ml-auto max-w-[80%] bg-blue-600" : "mr-auto max-w-[80%] bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-zinc-50">{msg.username}</span>
                  {msg.is_flagged && (
                    <Badge variant="destructive" className="text-xs">
                      Flagged
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-100">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-zinc-800 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="border-zinc-700 bg-zinc-950 text-zinc-50"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
