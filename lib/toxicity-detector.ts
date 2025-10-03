import { generateObject } from "ai"
import { z } from "zod"

// Schema for toxicity analysis response
const toxicitySchema = z.object({
  toxicityScore: z.number().min(0).max(1).describe("Overall toxicity score from 0 (safe) to 1 (highly toxic)"),
  categories: z
    .array(z.string())
    .describe("Categories of toxicity detected: harassment, hate_speech, profanity, sexual, violence, spam"),
  severity: z.enum(["low", "medium", "high", "critical"]).describe("Severity level of the toxic content"),
  explanation: z.string().describe("Brief explanation of why the content was flagged"),
  shouldFlag: z.boolean().describe("Whether this message should be flagged for moderation"),
})

export type ToxicityAnalysis = z.infer<typeof toxicitySchema>

export async function analyzeToxicity(content: string): Promise<ToxicityAnalysis> {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: toxicitySchema,
      prompt: `Analyze the following message for toxic content. Consider harassment, hate speech, profanity, sexual content, violence, and spam.

Message: "${content}"

Provide a toxicity score (0-1), identify categories, assess severity, explain your reasoning, and determine if it should be flagged for moderation.

Guidelines:
- Score 0.0-0.3: Safe content
- Score 0.3-0.6: Mildly concerning, monitor
- Score 0.6-0.8: Toxic, should be flagged
- Score 0.8-1.0: Highly toxic, immediate action required

Be balanced and avoid false positives for casual language while catching genuinely harmful content.`,
    })

    return object
  } catch (error) {
    console.error("[v0] Error analyzing toxicity:", error)
    // Return safe default on error
    return {
      toxicityScore: 0,
      categories: [],
      severity: "low",
      explanation: "Analysis failed, defaulting to safe",
      shouldFlag: false,
    }
  }
}

// Batch analyze multiple messages
export async function analyzeToxicityBatch(messages: string[]): Promise<ToxicityAnalysis[]> {
  const analyses = await Promise.all(messages.map((content) => analyzeToxicity(content)))
  return analyses
}

// Quick check if content is likely toxic (for real-time filtering)
export function isLikelyToxic(content: string): boolean {
  const toxicPatterns = [
    /\b(fuck|shit|damn|bitch|asshole|bastard)\b/gi,
    /\b(kill yourself|kys|die|suicide)\b/gi,
    /\b(hate|stupid|idiot|moron|dumb)\b/gi,
  ]

  return toxicPatterns.some((pattern) => pattern.test(content))
}
