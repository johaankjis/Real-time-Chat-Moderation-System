import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    // Get message volume over time
    const messageVolume = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM messages
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Get toxicity distribution
    const toxicityDistribution = await sql`
      SELECT 
        CASE 
          WHEN toxicity_score < 0.3 THEN 'safe'
          WHEN toxicity_score < 0.6 THEN 'moderate'
          WHEN toxicity_score < 0.8 THEN 'toxic'
          ELSE 'severe'
        END as category,
        COUNT(*) as count
      FROM messages
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY category
    `

    // Get top flagged users
    const topFlaggedUsers = await sql`
      SELECT 
        m.username,
        COUNT(*) as flag_count,
        AVG(m.toxicity_score) as avg_toxicity
      FROM messages m
      WHERE m.is_flagged = TRUE
        AND m.created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY m.username
      ORDER BY flag_count DESC
      LIMIT 10
    `

    // Get moderation actions over time
    const moderationActions = await sql`
      SELECT 
        DATE(created_at) as date,
        action_type,
        COUNT(*) as count
      FROM moderation_actions
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at), action_type
      ORDER BY date ASC
    `

    // Get hourly activity
    const hourlyActivity = await sql`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count,
        AVG(toxicity_score) as avg_toxicity
      FROM messages
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY hour
      ORDER BY hour ASC
    `

    return NextResponse.json({
      messageVolume,
      toxicityDistribution,
      topFlaggedUsers,
      moderationActions,
      hourlyActivity,
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
