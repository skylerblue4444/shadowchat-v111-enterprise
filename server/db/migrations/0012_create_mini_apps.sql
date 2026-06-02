-- Migration 0012: Create mini_apps table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS mini_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), developer_id UUID REFERENCES users(id), name VARCHAR(255) NOT NULL, description TEXT, icon TEXT, category VARCHAR(100), permissions JSONB, config JSONB, status VARCHAR(50) DEFAULT 'pending', downloads INTEGER DEFAULT 0, rating NUMERIC(3,2) DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mini_apps_created_at ON mini_apps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mini_apps_status ON mini_apps(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_mini_apps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mini_apps_updated_at
  BEFORE UPDATE ON mini_apps
  FOR EACH ROW
  EXECUTE FUNCTION update_mini_apps_updated_at();
