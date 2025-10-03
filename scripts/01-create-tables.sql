-- Create users table to track chat participants
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  reputation_score INTEGER DEFAULT 100,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table to store all chat messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  channel VARCHAR(100) DEFAULT 'general',
  toxicity_score DECIMAL(3, 2) DEFAULT 0.0,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create moderation_flags table to track flagged content
CREATE TABLE IF NOT EXISTS moderation_flags (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
  flag_type VARCHAR(50) NOT NULL, -- 'toxicity', 'spam', 'harassment', etc.
  confidence_score DECIMAL(3, 2) NOT NULL,
  details JSONB,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create moderation_actions table to log all moderation decisions
CREATE TABLE IF NOT EXISTS moderation_actions (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
  moderator_id INTEGER REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL, -- 'delete', 'warn', 'ban', 'approve'
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_flagged ON messages(is_flagged);
CREATE INDEX IF NOT EXISTS idx_moderation_flags_message_id ON moderation_flags(message_id);
CREATE INDEX IF NOT EXISTS idx_moderation_flags_status ON moderation_flags(status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
