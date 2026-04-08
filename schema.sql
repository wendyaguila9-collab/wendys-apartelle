-- Wendy's Apartelle Financial Tracker
-- PostgreSQL Schema (for future Supabase integration)
-- Currently using localStorage, this schema is for reference / future migration

-- Business areas reference
CREATE TABLE IF NOT EXISTS business_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  text_color TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- Income categories
CREATE TABLE IF NOT EXISTS income_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'income'
);

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'expense'
);

-- Income records
CREATE TABLE IF NOT EXISTS income (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  business_area_id TEXT NOT NULL REFERENCES business_areas(id),
  category_id TEXT NOT NULL REFERENCES income_categories(id),
  payment_method TEXT NOT NULL,
  description TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense records
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  business_area_id TEXT NOT NULL REFERENCES business_areas(id),
  category_id TEXT NOT NULL REFERENCES expense_categories(id),
  payment_method TEXT NOT NULL,
  description TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debt records
CREATE TABLE IF NOT EXISTS debts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_name TEXT NOT NULL,
  original_amount NUMERIC(12, 2) NOT NULL CHECK (original_amount > 0),
  remaining_balance NUMERIC(12, 2) NOT NULL CHECK (remaining_balance >= 0),
  interest_rate NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (interest_rate >= 0),
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'overdue', 'paid')),
  purpose TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debt payment records
CREATE TABLE IF NOT EXISTS debt_payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id TEXT NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount_paid NUMERIC(12, 2) NOT NULL CHECK (amount_paid > 0),
  balance_after NUMERIC(12, 2) NOT NULL CHECK (balance_after >= 0),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date DESC);
CREATE INDEX IF NOT EXISTS idx_income_business_area ON income(business_area_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_business_area ON expenses(business_area_id);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
CREATE INDEX IF NOT EXISTS idx_debt_payments_debt_id ON debt_payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_debt_payments_date ON debt_payments(payment_date DESC);

-- Seed reference data
INSERT INTO business_areas (id, name, color, bg_color, text_color, icon) VALUES
  ('apartelle', 'Apartelle', '#0F766E', '#F0FDFA', '#0F766E', 'Building2'),
  ('dress-shop', 'Dress Shop', '#F97366', '#FFF1F0', '#F97366', 'ShoppingBag'),
  ('captain', 'Captain''s Income', '#1D4ED8', '#EFF6FF', '#1D4ED8', 'Anchor'),
  ('household', 'Household', '#FB923C', '#FFF7ED', '#FB923C', 'Home')
ON CONFLICT (id) DO NOTHING;

INSERT INTO income_categories (id, name, type) VALUES
  ('room-rental', 'Room Rental', 'income'),
  ('dress-sales', 'Dress Sales', 'income'),
  ('remittance', 'Remittance', 'income'),
  ('other-income', 'Other Income', 'income'),
  ('food-sales', 'Food Sales', 'income'),
  ('service-fee', 'Service Fee', 'income')
ON CONFLICT (id) DO NOTHING;

INSERT INTO expense_categories (id, name, type) VALUES
  ('utilities', 'Utilities', 'expense'),
  ('maintenance', 'Maintenance & Repairs', 'expense'),
  ('supplies', 'Supplies & Inventory', 'expense'),
  ('food', 'Food & Groceries', 'expense'),
  ('salary', 'Salary & Labor', 'expense'),
  ('transportation', 'Transportation', 'expense'),
  ('education', 'School & Education', 'expense'),
  ('medical', 'Medical', 'expense'),
  ('debt-payment', 'Debt Payment', 'expense'),
  ('miscellaneous', 'Miscellaneous', 'expense')
ON CONFLICT (id) DO NOTHING;
