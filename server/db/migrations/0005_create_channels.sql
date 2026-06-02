-- Migration 0005: Create channels table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(255) NOT NULL, type VARCHAR(50) DEFAULT 'group', description TEXT, avatar TEXT, metadata JSONB, tenant_id UUID, created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_channels_created_at ON channels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channels_status ON channels(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_channels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW
  EXECUTE FUNCTION update_channels_updated_at();
