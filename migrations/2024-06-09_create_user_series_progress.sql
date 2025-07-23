-- Migration: Create user_series_progress table for per-user, per-series aggregated progress
CREATE TABLE IF NOT EXISTS user_series_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  series_id TEXT NOT NULL,
  chapters_completed INTEGER DEFAULT 0,
  total_chapters INTEGER DEFAULT 0,
  cards_studied INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_studied TIMESTAMP,
  average_accuracy REAL DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, series_id)
); 