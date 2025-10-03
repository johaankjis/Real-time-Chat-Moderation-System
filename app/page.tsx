import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, MessageSquare, BarChart3, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Real-Time Moderation System</span>
          </div>

          <h1 className="font-bold text-5xl text-zinc-50 leading-tight text-balance">AI-Powered Chat Moderation</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed text-pretty">
            Protect your community with intelligent, real-time content moderation. Detect toxicity, harassment, and
            harmful content instantly with AI-powered analysis.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
            >
              <Link href="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                Try Chat Demo
              </Link>
            </Button>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "Real-Time Detection",
                description: "Instant toxicity analysis on every message",
              },
              {
                icon: Shield,
                title: "AI-Powered",
                description: "Advanced NLP models for accurate detection",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Track metrics and moderation trends",
              },
              {
                icon: MessageSquare,
                title: "Live Monitoring",
                description: "Watch messages flow in real-time",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-zinc-800 bg-zinc-900/50 p-6 text-left">
                <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-zinc-50">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
