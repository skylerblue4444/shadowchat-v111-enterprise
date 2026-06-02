-- Migration 0018: Create groups table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(255) NOT NULL, description TEXT, avatar TEXT, type VARCHAR(50) DEFAULT 'public', member_count INTEGER DEFAULT 0, rules JSONB, created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_groups_updated_at();
