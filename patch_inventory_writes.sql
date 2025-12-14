-- ==============================================================================
-- PATCH: ENABLE INVENTORY WRITES (MVP/DEMO MODE)
-- ==============================================================================
-- This enables the public (anon) role to Create, Update, and Delete products.
-- In a production app, you would restrict this to authenticated admins only.

-- 1. Policies for 'products' table
CREATE POLICY "Public Insert Products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON products FOR DELETE USING (true);

-- 2. Policies for 'variants' table
CREATE POLICY "Public Insert Variants" ON variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Variants" ON variants FOR UPDATE USING (true);
CREATE POLICY "Public Delete Variants" ON variants FOR DELETE USING (true);
