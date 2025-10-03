-- Insert sample users for testing
INSERT INTO users (username, email, reputation_score) VALUES
  ('moderator', 'moderator@example.com', 100),
  ('alice', 'alice@example.com', 95),
  ('bob', 'bob@example.com', 88),
  ('charlie', 'charlie@example.com', 75)
ON CONFLICT (username) DO NOTHING;

-- Insert sample messages for testing
INSERT INTO messages (user_id, username, content, channel, toxicity_score, is_flagged) VALUES
  (2, 'alice', 'Hello everyone! Great to be here.', 'general', 0.05, FALSE),
  (3, 'bob', 'Welcome! How is everyone doing today?', 'general', 0.03, FALSE),
  (4, 'charlie', 'This is terrible content that should be flagged', 'general', 0.85, TRUE),
  (2, 'alice', 'Looking forward to chatting with you all!', 'general', 0.02, FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample moderation flags for testing
INSERT INTO moderation_flags (message_id, flag_type, confidence_score, details, status)
SELECT 
  m.id,
  'toxicity',
  0.85,
  '{"categories": ["offensive_language"], "severity": "high"}'::jsonb,
  'pending'
FROM messages m
WHERE m.is_flagged = TRUE
ON CONFLICT DO NOTHING;
