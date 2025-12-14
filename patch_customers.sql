-- ==============================================================================
-- PATCH: ADD BIRTH_DATE TO CUSTOMERS
-- ==============================================================================

ALTER TABLE customers ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Allow public access for demo (if not already enabled by previous scripts, ensuring it here for customers)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public Insert Customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Public Delete Customers" ON customers FOR DELETE USING (true);
