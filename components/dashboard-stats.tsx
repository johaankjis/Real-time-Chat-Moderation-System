"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle, MessageSquare, Shield, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    flaggedMessages: 0,
    moderationRate: 0,
    avgToxicity: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [messagesRes, flaggedRes] = await Promise.all([
          fetch("/api/messages?limit=1000"),
          fetch("/api/messages/flagged"),
        ])

        const messagesData = await messagesRes.json()
        const flaggedData = await flaggedRes.json()

        const total = messagesData.messages?.length || 0
        const flagged = flaggedData.flaggedMessages?.length || 0
        const avgTox =
          messagesData.messages?.reduce((sum: number, m: any) => sum + (m.toxicity_score || 0), 0) / total || 0

        setStats({
          totalMessages: total,
          flaggedMessages: flagged,
          moderationRate: total > 0 ? (flagged / total) * 100 : 0,
          avgToxicity: avgTox,
        })
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      label: "Total Messages",
      value: stats.totalMessages.toLocaleString(),
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Flagged Content",
      value: stats.flaggedMessages.toLocaleString(),
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Moderation Rate",
      value: `${stats.moderationRate.toFixed(1)}%`,
      icon: Shield,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Avg Toxicity",
      value: stats.avgToxicity.toFixed(3),
      icon: TrendingUp,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="mt-2 font-semibold text-2xl text-zinc-50">{stat.value}</p>
            </div>
            <div className={`rounded-lg ${stat.bgColor} p-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
