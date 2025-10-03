import { neon } from "@neondatabase/serverless"

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL!)

// Database query functions
export async function createMessage(username: string, content: string, channel = "general") {
  const result = await sql`
    INSERT INTO messages (user_id, username, content, channel, created_at)
    SELECT u.id, ${username}, ${content}, ${channel}, NOW()
    FROM users u
    WHERE u.username = ${username}
    RETURNING *
  `
  return result[0]
}

export async function getMessages(channel = "general", limit = 50) {
  const messages = await sql`
    SELECT 
      m.id,
      m.username,
      m.content,
      m.channel,
      m.toxicity_score,
      m.is_flagged,
      m.is_deleted,
      m.created_at,
      u.reputation_score
    FROM messages m
    LEFT JOIN users u ON m.user_id = u.id
    WHERE m.channel = ${channel} AND m.is_deleted = FALSE
    ORDER BY m.created_at DESC
    LIMIT ${limit}
  `
  return messages.reverse()
}

export async function getFlaggedMessages(status = "pending") {
  const flagged = await sql`
    SELECT 
      m.id,
      m.username,
      m.content,
      m.channel,
      m.toxicity_score,
      m.created_at,
      mf.flag_type,
      mf.confidence_score,
      mf.details,
      mf.status
    FROM messages m
    INNER JOIN moderation_flags mf ON m.id = mf.message_id
    WHERE mf.status = ${status}
    ORDER BY m.created_at DESC
  `
  return flagged
}

export async function createUser(username: string, email?: string) {
  const result = await sql`
    INSERT INTO users (username, email)
    VALUES (${username}, ${email || null})
    ON CONFLICT (username) DO UPDATE SET updated_at = NOW()
    RETURNING *
  `
  return result[0]
}

export async function updateMessageToxicity(messageId: number, toxicityScore: number, isFlagged: boolean) {
  const result = await sql`
    UPDATE messages
    SET toxicity_score = ${toxicityScore}, is_flagged = ${isFlagged}
    WHERE id = ${messageId}
    RETURNING *
  `
  return result[0]
}

export async function createModerationFlag(messageId: number, flagType: string, confidenceScore: number, details: any) {
  const result = await sql`
    INSERT INTO moderation_flags (message_id, flag_type, confidence_score, details)
    VALUES (${messageId}, ${flagType}, ${confidenceScore}, ${JSON.stringify(details)})
    RETURNING *
  `
  return result[0]
}

export async function deleteMessage(messageId: number, moderatorId: number, reason: string) {
  // Soft delete the message
  await sql`
    UPDATE messages
    SET is_deleted = TRUE
    WHERE id = ${messageId}
  `

  // Log the moderation action
  await sql`
    INSERT INTO moderation_actions (message_id, moderator_id, action_type, reason)
    VALUES (${messageId}, ${moderatorId}, 'delete', ${reason})
  `

  return { success: true }
}
