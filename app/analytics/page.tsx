import { AnalyticsCharts } from "@/components/analytics-charts"
import { AnalyticsMetrics } from "@/components/analytics-metrics"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-50">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold text-2xl text-zinc-50">Analytics & Insights</h1>
                <p className="text-sm text-zinc-400">Comprehensive moderation metrics and trends</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <AnalyticsMetrics />
        <div className="mt-8">
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  )
}
