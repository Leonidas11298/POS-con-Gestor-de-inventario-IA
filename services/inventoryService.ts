import { supabase } from './supabaseClient';
import { Product } from '../types';

export interface CreateProductDTO {
    name: string;
    category: string;
    description: string;
    image_url: string;
    sku: string;
    price: number;
    cost_price: number;
    current_stock: number;
    min_stock_threshold: number;
    size?: string;
    color?: string;
}

export const createProduct = async (data: CreateProductDTO) => {
    // 1. Insert Base Product
    const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
            name: data.name,
            category: data.category,
            description: data.description,
            image_url: data.image_url
        })
        .select()
        .single();

    if (productError) throw productError;
    if (!productData) throw new Error("Failed to create product");

    // 2. Insert Default Variant
    const { error: variantError } = await supabase
        .from('variants')
        .insert({
            product_id: productData.id,
            sku: data.sku,
            price: data.price,
            cost_price: data.cost_price,
            current_stock: data.current_stock,
            min_stock_threshold: data.min_stock_threshold,
            size: data.size,
            color: data.color
        });

    if (variantError) {
        // Cleanup if variant fails (simulate transaction)
        await supabase.from('products').delete().eq('id', productData.id);
        throw variantError;
    }

    return productData;
};

export const updateProduct = async (productId: string | number, variantId: string | number, data: CreateProductDTO) => {
    // 1. Update Base Product
    const { error: productError } = await supabase
        .from('products')
        .update({
            name: data.name,
            category: data.category,
            description: data.description,
            image_url: data.image_url
        })
        .eq('id', productId);

    if (productError) throw productError;

    // 2. Update Variant
    const { error: variantError } = await supabase
        .from('variants')
        .update({
            sku: data.sku,
            price: data.price,
            cost_price: data.cost_price,
            current_stock: data.current_stock,
            min_stock_threshold: data.min_stock_threshold,
            size: data.size,
            color: data.color
        })
        .eq('id', variantId);

    if (variantError) throw variantError;
    return true;
};

export const deleteProduct = async (productId: string | number) => {
    // Cascading delete should handle variants, but let's be safe if not configured
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) throw error;
    return true;
};
