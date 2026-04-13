-- PiBreath — Supabase setup
-- Chạy trong Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS users (
  pi_uid            TEXT PRIMARY KEY,
  username          TEXT NOT NULL,
  streak_days       INTEGER NOT NULL DEFAULT 0,
  best_streak       INTEGER NOT NULL DEFAULT 0,
  last_session_date TEXT NOT NULL DEFAULT '',
  total_minutes     INTEGER NOT NULL DEFAULT 0,
  total_sessions    INTEGER NOT NULL DEFAULT 0,
  tree_stage        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pi_uid           TEXT NOT NULL,
  technique_name   TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  completed        BOOLEAN NOT NULL DEFAULT TRUE,
  mood_before      INTEGER NOT NULL DEFAULT 0,
  mood_after       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_pi_uid ON sessions (pi_uid);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions (created_at DESC);

ALTER TABLE users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_all"    ON users    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "sessions_all" ON sessions FOR ALL USING (true) WITH CHECK (true);
