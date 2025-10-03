import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get overall metrics
    const [totalMessages] = await sql`SELECT COUNT(*) as count FROM messages`
    const [totalFlagged] = await sql`SELECT COUNT(*) as count FROM messages WHERE is_flagged = TRUE`
    const [totalDeleted] = await sql`SELECT COUNT(*) as count FROM messages WHERE is_deleted = TRUE`
    const [avgToxicity] = await sql`SELECT AVG(toxicity_score) as avg FROM messages`
    const [totalUsers] = await sql`SELECT COUNT(DISTINCT username) as count FROM messages`

    // Get today's metrics
    const [todayMessages] = await sql`
      SELECT COUNT(*) as count FROM messages 
      WHERE DATE(created_at) = CURRENT_DATE
    `
    const [todayFlagged] = await sql`
      SELECT COUNT(*) as count FROM messages 
      WHERE is_flagged = TRUE AND DATE(created_at) = CURRENT_DATE
    `

    // Get response time (average time from flag to action)
    const [avgResponseTime] = await sql`
      SELECT AVG(EXTRACT(EPOCH FROM (ma.created_at - mf.created_at))) as avg_seconds
      FROM moderation_actions ma
      JOIN moderation_flags mf ON ma.message_id = mf.message_id
      WHERE ma.created_at >= NOW() - INTERVAL '7 days'
    `

    return NextResponse.json({
      total: {
        messages: Number(totalMessages.count),
        flagged: Number(totalFlagged.count),
        deleted: Number(totalDeleted.count),
        users: Number(totalUsers.count),
        avgToxicity: Number(avgToxicity.avg) || 0,
      },
      today: {
        messages: Number(todayMessages.count),
        flagged: Number(todayFlagged.count),
      },
      performance: {
        avgResponseTimeSeconds: Number(avgResponseTime.avg_seconds) || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
