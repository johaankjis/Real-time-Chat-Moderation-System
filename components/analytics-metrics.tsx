"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"

export function AnalyticsMetrics() {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMetrics() {
    try {
      const response = await fetch("/api/analytics/metrics")
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("[v0] Error fetching metrics:", error)
    }
  }

  if (!metrics) {
    return <div className="text-center text-zinc-500">Loading metrics...</div>
  }

  const flagRate = metrics.total.messages > 0 ? (metrics.total.flagged / metrics.total.messages) * 100 : 0
  const deleteRate = metrics.total.messages > 0 ? (metrics.total.deleted / metrics.total.messages) * 100 : 0

  const metricCards = [
    {
      label: "Total Messages Processed",
      value: metrics.total.messages.toLocaleString(),
      subtext: `${metrics.today.messages} today`,
      icon: Activity,
      trend: metrics.today.messages > 0 ? "up" : "neutral",
    },
    {
      label: "Flag Rate",
      value: `${flagRate.toFixed(1)}%`,
      subtext: `${metrics.total.flagged} flagged`,
      icon: TrendingUp,
      trend: flagRate > 5 ? "up" : "down",
    },
    {
      label: "Average Toxicity Score",
      value: (metrics.total.avgToxicity * 100).toFixed(1),
      subtext: "Lower is better",
      icon: Activity,
      trend: metrics.total.avgToxicity < 0.3 ? "down" : "up",
    },
    {
      label: "Avg Response Time",
      value: `${Math.round(metrics.performance.avgResponseTimeSeconds)}s`,
      subtext: "Flag to action",
      icon: Clock,
      trend: metrics.performance.avgResponseTimeSeconds < 60 ? "down" : "up",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric) => (
        <Card key={metric.label} className="border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-zinc-400">{metric.label}</p>
              <p className="mt-2 font-bold text-3xl text-zinc-50">{metric.value}</p>
              <div className="mt-2 flex items-center gap-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-red-400" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-emerald-400" />
                ) : null}
                <p className="text-xs text-zinc-500">{metric.subtext}</p>
              </div>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2">
              <metric.icon className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
