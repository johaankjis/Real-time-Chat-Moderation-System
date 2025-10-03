import { type NextRequest, NextResponse } from "next/server"
import { analyzeToxicity, analyzeToxicityBatch } from "@/lib/toxicity-detector"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, batch } = body

    if (batch && Array.isArray(batch)) {
      // Batch analysis
      const analyses = await analyzeToxicityBatch(batch)
      return NextResponse.json({ analyses })
    }

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Single analysis
    const analysis = await analyzeToxicity(content)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] Error analyzing content:", error)
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 })
  }
}
