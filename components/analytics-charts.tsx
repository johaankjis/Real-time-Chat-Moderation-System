"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function AnalyticsCharts() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/analytics/overview?days=7")
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("[v0] Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-zinc-500">Loading analytics...</div>
  }

  if (!data) {
    return <div className="text-center text-zinc-500">No analytics data available</div>
  }

  const COLORS = {
    safe: "#10b981",
    moderate: "#f59e0b",
    toxic: "#f97316",
    severe: "#ef4444",
  }

  return (
    <div className="space-y-6">
      {/* Message Volume Over Time */}
      <Card className="border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-lg text-zinc-50">Message Volume (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.messageVolume}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Messages" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Toxicity Distribution */}
        <Card className="border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 font-semibold text-lg text-zinc-50">Toxicity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.toxicityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.toxicityDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.category as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Hourly Activity */}
        <Card className="border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 font-semibold text-lg text-zinc-50">Hourly Activity Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="hour" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Flagged Users */}
      <Card className="border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 font-semibold text-lg text-zinc-50">Top Flagged Users</h3>
        <div className="space-y-3">
          {data.topFlaggedUsers.slice(0, 5).map((user: any, index: number) => (
            <div
              key={user.username}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 font-medium text-sm text-zinc-400">
                  {index + 1}
                </span>
                <span className="font-medium text-zinc-300">{user.username}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Flags</p>
                  <p className="font-semibold text-zinc-50">{user.flag_count}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Avg Toxicity</p>
                  <p className="font-semibold text-amber-400">{(Number(user.avg_toxicity) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
