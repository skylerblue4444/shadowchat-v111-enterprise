-- Migration 0008: Create products table
-- Generated: 2026-06-02
-- ShadowChat Enterprise Platform v111

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), seller_id UUID REFERENCES users(id), name VARCHAR(500) NOT NULL, description TEXT, price BIGINT NOT NULL, currency VARCHAR(3) DEFAULT 'USD', category VARCHAR(100), images JSONB, inventory INTEGER DEFAULT 0, status VARCHAR(50) DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status) WHERE status IS NOT NULL;

-- Triggers
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();
