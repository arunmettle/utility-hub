CREATE TABLE IF NOT EXISTS feedback_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  tool_id TEXT NOT NULL DEFAULT '',
  workflow TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('worked', 'partly-worked', 'did-not-work')),
  missing TEXT NOT NULL,
  email TEXT,
  can_contact INTEGER NOT NULL DEFAULT 0 CHECK (can_contact IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_feedback_submissions_created_at
  ON feedback_submissions (created_at DESC);

CREATE TABLE IF NOT EXISTS wishlist_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('new-tool', 'improve-tool', 'workflow')),
  title TEXT NOT NULL,
  tool_id TEXT,
  pain_point TEXT NOT NULL,
  ideal_outcome TEXT NOT NULL,
  workaround TEXT,
  email TEXT
);

CREATE INDEX IF NOT EXISTS idx_wishlist_submissions_created_at
  ON wishlist_submissions (created_at DESC);
