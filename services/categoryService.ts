import { supabase } from './supabaseClient';
import { CategoryData } from '../types';

export interface Category {
    id: number;
    name: string;
    created_at?: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
};

export const createCategory = async (name: string): Promise<Category | null> => {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }
    return true;
};
