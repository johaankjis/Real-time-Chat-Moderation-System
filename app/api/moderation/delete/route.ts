import { type NextRequest, NextResponse } from "next/server"
import { deleteMessage } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, moderatorId, reason } = body

    if (!messageId || !moderatorId) {
      return NextResponse.json({ error: "Message ID and moderator ID are required" }, { status: 400 })
    }

    const result = await deleteMessage(messageId, moderatorId, reason || "Violated community guidelines")

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
