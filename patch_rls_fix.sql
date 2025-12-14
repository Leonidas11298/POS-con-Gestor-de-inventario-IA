-- ==============================================================================
-- PATCH: FIX RLS ERROR ON CHECKOUT
-- ==============================================================================

-- Re-create the function with SECURITY DEFINER.
-- This allows the function to bypass Row Level Security policies of the table
-- and run with the permissions of the function creator (postgres/admin).

CREATE OR REPLACE FUNCTION complete_sale(
    p_customer_id BIGINT,
    p_payment_method TEXT,
    p_items JSONB
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER -- <--- THIS IS THE KEY CHANGE
AS $$
DECLARE
    v_order_id BIGINT;
    v_total NUMERIC(10,2) := 0;
    v_item JSONB;
    v_variant_id BIGINT;
    v_qty INTEGER;
    v_price NUMERIC(10,2);
BEGIN
    -- Calculate total
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_qty := (v_item->>'quantity')::INTEGER;
        v_price := (v_item->>'price')::NUMERIC;
        v_total := v_total + (v_qty * v_price);
    END LOOP;

    -- Create Order Header
    INSERT INTO orders (customer_id, payment_method, total_amount, status)
    VALUES (p_customer_id, p_payment_method, v_total, 'completed')
    RETURNING id INTO v_order_id;

    -- Process Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_variant_id := (v_item->>'variant_id')::BIGINT;
        v_qty := (v_item->>'quantity')::INTEGER;
        v_price := (v_item->>'price')::NUMERIC;

        -- Deduct Stock
        UPDATE variants
        SET current_stock = current_stock - v_qty,
            updated_at = NOW()
        WHERE id = v_variant_id;

        -- Record Item
        INSERT INTO order_items (order_id, variant_id, quantity, unit_price)
        VALUES (v_order_id, v_variant_id, v_qty, v_price);
    END LOOP;

    RETURN v_order_id;
END;
$$;

-- Ensure public can execute it
GRANT EXECUTE ON FUNCTION complete_sale TO anon;
GRANT EXECUTE ON FUNCTION complete_sale TO authenticated;

