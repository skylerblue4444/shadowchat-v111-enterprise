-- Migration 0017: Create events table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organizer_id UUID REFERENCES users(id), title VARCHAR(500) NOT NULL, description TEXT, location JSONB, start_at TIMESTAMPTZ NOT NULL, end_at TIMESTAMPTZ, capacity INTEGER, attendees INTEGER DEFAULT 0, status VARCHAR(50) DEFAULT 'upcoming', created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();
