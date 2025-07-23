-- Migration: Create user_chapter_progress table for per-user, per-chapter study progress
CREATE TABLE IF NOT EXISTS user_chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  series_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  cards_studied INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  accuracy REAL DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  last_studied TIMESTAMP,
  streak INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, chapter_id)
);