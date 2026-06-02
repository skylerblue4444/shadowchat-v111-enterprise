-- Migration 0011: Create wallets table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID UNIQUE NOT NULL REFERENCES users(id), balance BIGINT DEFAULT 0, currency VARCHAR(3) DEFAULT 'USD', status VARCHAR(50) DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wallets_created_at ON wallets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_wallets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_wallets_updated_at();
