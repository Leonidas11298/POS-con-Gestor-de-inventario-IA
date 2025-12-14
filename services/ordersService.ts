import { supabase } from './supabaseClient';
import { Order } from '../types';

export interface OrderWithDetails extends Order {
    customer_name: string;
    items_count: number;
}

export interface OrderItemDetail {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image_url?: string;
}

export const getOrders = async (): Promise<OrderWithDetails[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            id,
            created_at,
            total_amount,
            payment_method,
            status,
            customer_id,
            customers (
                full_name
            ),
            order_items (
                count
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return (data || []).map((order: any) => ({
        id: order.id,
        created_at: order.created_at,
        customer_id: order.customer_id,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        status: order.status,
        customer_name: order.customers?.full_name || 'Cliente Casual',
        items_count: order.order_items?.[0]?.count || 0
    }));
};

export const getOrderItems = async (orderId: number): Promise<OrderItemDetail[]> => {
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            id,
            quantity,
            unit_price,
            subtotal,
            variants (
                products (
                    name,
                    image_url
                )
            )
        `)
        .eq('order_id', orderId);

    if (error) {
        console.error('Error fetching order items:', error);
        return [];
    }

    return (data || []).map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        product_name: item.variants?.products?.name || 'Producto Desconocido',
        image_url: item.variants?.products?.image_url
    }));
};
