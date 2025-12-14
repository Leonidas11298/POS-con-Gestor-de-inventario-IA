import { supabase } from './supabaseClient';

export interface StoreSettings {
    id: number;
    store_name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    tax_rate: number;
    currency: string;
}

export const getStoreSettings = async (): Promise<StoreSettings | null> => {
    // Always fetch the first row
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching settings:', error);
        return null; // Return null instead of empty object
    }
    return data;
};

export const updateStoreSettings = async (id: number, settings: Partial<StoreSettings>) => {
    const { error } = await supabase
        .from('store_settings')
        .update(settings)
        .eq('id', id);

    if (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
    return true;
};
