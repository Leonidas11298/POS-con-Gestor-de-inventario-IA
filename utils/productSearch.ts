import { MOCK_INVENTORY } from '../constants';
import { Product } from '../types';

export const searchProducts = async (query: string): Promise<Product[]> => {
    const lowercaseQuery = query.toLowerCase();
    return MOCK_INVENTORY.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        (product as any).sku?.toLowerCase().includes(lowercaseQuery) // Checking SKU if it existed in mock, though MOCK_INVENTORY in constants might imply logic update needed
    );
};
