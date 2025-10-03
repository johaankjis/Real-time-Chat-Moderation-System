import { FlaggedMessages } from "@/components/flagged-messages"
import { LiveMessageFeed } from "@/components/live-message-feed"
import { DashboardStats } from "@/components/dashboard-stats"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-2xl text-zinc-50">Moderation Dashboard</h1>
              <p className="text-sm text-zinc-400">Real-time chat monitoring and content moderation</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
              >
                <Link href="/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-emerald-400">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <DashboardStats />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <FlaggedMessages />
          <LiveMessageFeed />
        </div>
      </main>
    </div>
  )
}
