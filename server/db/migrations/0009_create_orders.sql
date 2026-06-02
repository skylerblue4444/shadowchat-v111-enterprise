-- Migration 0009: Create orders table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), buyer_id UUID REFERENCES users(id), seller_id UUID REFERENCES users(id), items JSONB NOT NULL, total BIGINT NOT NULL, currency VARCHAR(3) DEFAULT 'USD', status VARCHAR(50) DEFAULT 'pending', shipping_address JSONB, tracking JSONB, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
