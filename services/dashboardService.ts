import { supabase } from './supabaseClient';
import { DailySalesView, LowStockView, ProductWithVariant, CategoryData } from '../types';

export const getDailySales = async (): Promise<DailySalesView[]> => {
    const { data, error } = await supabase
        .from('view_daily_sales')
        .select('*')
        .order('day', { ascending: true })
        .limit(10); // Last 10 days

    if (error) {
        console.error('Error fetching daily sales:', error);
        return [];
    }
    return data || [];
};

export const getLowStockItems = async (): Promise<LowStockView[]> => {
    const { data, error } = await supabase
        .from('view_low_stock')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching low stock:', error);
        return [];
    }
    return data || [];
};

export const getInventory = async (): Promise<ProductWithVariant[]> => {
    // Join variants with products
    const { data, error } = await supabase
        .from('variants')
        .select(`
      id,
      sku,
      current_stock,
      sale_price,
      min_stock_threshold,
      products (
        name,
        category,
        image_url
      )
    `)
        .limit(50);

    if (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }

    // Transform to flat structure for UI
    return (data || []).map((item: any) => ({
        id: item.products?.id || 0, // Note: Product ID not directly in variant unless selected, assuming join works
        variant_id: item.id,
        name: item.products?.name || 'Unknown',
        category: item.products?.category || 'Uncategorized',
        sku: item.sku,
        stock: item.current_stock,
        price: item.sale_price,
        status: item.current_stock <= 0 ? 'Overstock' : (item.current_stock <= item.min_stock_threshold ? 'Reorder' : 'Healthy'), // Simple logic, can be improved
        image_url: item.products?.image_url
    }));
};

export const getCategoryDistribution = async (): Promise<CategoryData[]> => {
    // Since we don't have a direct view, we'll approximate by counting products in categories
    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    const counts: Record<string, number> = {};
    data?.forEach((p: any) => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

    return Object.entries(counts).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
    }));
};

export const getTotalStats = async () => {
    // Parallel fetch for cards
    const [salesResponse, ordersResponse, lowStockResponse] = await Promise.all([
        supabase.from('view_daily_sales').select('total_revenue, total_orders'),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('view_low_stock').select('sku', { count: 'exact' })
    ]);

    // Aggregate total revenue from daily view
    let totalRevenue = 0;
    let totalOrders = 0;

    salesResponse.data?.forEach((day: any) => {
        totalRevenue += Number(day.total_revenue || 0);
        totalOrders += Number(day.total_orders || 0);
    });

    const lowStockCount = lowStockResponse.count || 0;

    return {
        revenue: totalRevenue,
        orders: totalOrders,
        lowStockCount
    };
};
