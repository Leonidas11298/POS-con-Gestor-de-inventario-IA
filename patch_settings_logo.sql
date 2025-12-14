-- ==============================================================================
-- PATCH: STORE SETTINGS LOGO
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'logo_url') THEN
        ALTER TABLE store_settings ADD COLUMN logo_url TEXT;
    END IF;
END $$;
