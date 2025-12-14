import { supabase } from './supabaseClient';
import { Customer } from '../types';

export const getCustomers = async (): Promise<Customer[]> => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
    return data || [];
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer | null> => {
    const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

    if (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
    return data;
};

export const updateCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer | null> => {
    const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
    return data;
};

export const deleteCustomer = async (id: number): Promise<boolean> => {
    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
    return true;
};
