import { type NextRequest, NextResponse } from "next/server"
import { getFlaggedMessages } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    const flaggedMessages = await getFlaggedMessages(status)

    return NextResponse.json({ flaggedMessages })
  } catch (error) {
    console.error("[v0] Error fetching flagged messages:", error)
    return NextResponse.json({ error: "Failed to fetch flagged messages" }, { status: 500 })
  }
}
