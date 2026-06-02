-- Migration 0020: Create bookings table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), service_id UUID, provider_id UUID REFERENCES users(id), start_at TIMESTAMPTZ NOT NULL, end_at TIMESTAMPTZ NOT NULL, status VARCHAR(50) DEFAULT 'confirmed', amount BIGINT, notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();
