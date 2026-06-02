-- Migration 0019: Create payments table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), from_user_id UUID REFERENCES users(id), to_user_id UUID REFERENCES users(id), amount BIGINT NOT NULL, currency VARCHAR(3) DEFAULT 'USD', method VARCHAR(50), status VARCHAR(50) DEFAULT 'pending', reference VARCHAR(255), metadata JSONB, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();
