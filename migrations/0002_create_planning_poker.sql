CREATE TABLE IF NOT EXISTS planning_poker_rooms (
  room_id TEXT PRIMARY KEY,
  room_name TEXT NOT NULL,
  host_name TEXT NOT NULL,
  host_token TEXT NOT NULL,
  card_set_id TEXT NOT NULL,
  custom_cards_source TEXT NOT NULL DEFAULT '',
  current_story_id TEXT,
  revealed INTEGER NOT NULL DEFAULT 0 CHECK (revealed IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_planning_poker_rooms_expires_at
  ON planning_poker_rooms (expires_at);

CREATE TABLE IF NOT EXISTS planning_poker_participants (
  participant_id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  name TEXT NOT NULL,
  access_token TEXT,
  joined_at TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (room_id, name)
);

CREATE INDEX IF NOT EXISTS idx_planning_poker_participants_room_id
  ON planning_poker_participants (room_id);

CREATE TABLE IF NOT EXISTS planning_poker_stories (
  story_id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'finalized')),
  final_estimate TEXT,
  round_number INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_planning_poker_stories_room_id
  ON planning_poker_stories (room_id, sort_order);

CREATE TABLE IF NOT EXISTS planning_poker_votes (
  room_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  vote TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (room_id, story_id, participant_id)
);

CREATE INDEX IF NOT EXISTS idx_planning_poker_votes_room_story
  ON planning_poker_votes (room_id, story_id);

CREATE TABLE IF NOT EXISTS planning_poker_rounds (
  round_id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  story_label TEXT NOT NULL,
  story_title TEXT NOT NULL DEFAULT '',
  story_url TEXT NOT NULL DEFAULT '',
  final_estimate TEXT NOT NULL,
  card_set_id TEXT NOT NULL,
  card_set_name TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  summary_json TEXT NOT NULL,
  votes_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_planning_poker_rounds_room_id
  ON planning_poker_rounds (room_id, created_at DESC);
