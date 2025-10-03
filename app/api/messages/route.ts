import { type NextRequest, NextResponse } from "next/server"
import { createMessage, getMessages, createUser, updateMessageToxicity, createModerationFlag } from "@/lib/db"
import { analyzeToxicity } from "@/lib/toxicity-detector"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channel = searchParams.get("channel") || "general"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const messages = await getMessages(channel, limit)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, content, channel = "general" } = body

    if (!username || !content) {
      return NextResponse.json({ error: "Username and content are required" }, { status: 400 })
    }

    // Ensure user exists
    await createUser(username)

    // Create the message
    const message = await createMessage(username, content, channel)

    analyzeToxicity(content)
      .then(async (analysis) => {
        // Update message with toxicity score
        await updateMessageToxicity(message.id, analysis.toxicityScore, analysis.shouldFlag)

        // Create moderation flag if needed
        if (analysis.shouldFlag) {
          await createModerationFlag(message.id, "toxicity", analysis.toxicityScore, {
            categories: analysis.categories,
            severity: analysis.severity,
            explanation: analysis.explanation,
          })
        }
      })
      .catch((error) => {
        console.error("[v0] Error in toxicity analysis:", error)
      })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
