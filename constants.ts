import { Product, SalesData, CategoryData } from './types';

export const MOCK_SALES_DATA: SalesData[] = [
  { day: '1 Jul', revenue: 4000, cost: 2400 },
  { day: '2 Jul', revenue: 3000, cost: 1398 },
  { day: '3 Jul', revenue: 5000, cost: 3000 },
  { day: '4 Jul', revenue: 2780, cost: 3908 },
  { day: '5 Jul', revenue: 6890, cost: 4800 },
  { day: '6 Jul', revenue: 5390, cost: 3800 },
  { day: '7 Jul', revenue: 3490, cost: 4300 },
  { day: '8 Jul', revenue: 6000, cost: 4100 },
  { day: '9 Jul', revenue: 5500, cost: 3200 },
  { day: '10 Jul', revenue: 7000, cost: 4500 },
];

export const MOCK_CATEGORY_DATA: CategoryData[] = [
  { name: 'Pants', value: 35, color: '#10B981' }, // Emerald 500
  { name: 'Shirts', value: 25, color: '#3B82F6' }, // Blue 500
  { name: 'Dresses', value: 20, color: '#8B5CF6' }, // Violet 500
  { name: 'Access.', value: 20, color: '#F59E0B' }, // Amber 500
];

export const MOCK_INVENTORY: Product[] = [
  { id: '1', name: 'Slim Fit Jeans (Black)', category: 'Pants', stock: 12, price: 45.00, salesVelocity: 'High', status: 'Reorder' },
  { id: '2', name: 'Cotton T-Shirt (White)', category: 'Shirts', stock: 150, price: 20.00, salesVelocity: 'Medium', status: 'Healthy' },
  { id: '3', name: 'Summer Floral Dress', category: 'Dresses', stock: 5, price: 65.00, salesVelocity: 'High', status: 'Reorder' },
  { id: '4', name: 'Leather Belt', category: 'Accessories', stock: 8, price: 35.00, salesVelocity: 'Low', status: 'Reorder' },
  { id: '5', name: 'Office Chinos (Beige)', category: 'Pants', stock: 89, price: 55.00, salesVelocity: 'Medium', status: 'Healthy' },
  { id: '6', name: 'Wool Sweater', category: 'Shirts', stock: 200, price: 80.00, salesVelocity: 'Low', status: 'Overstock' },
];

export const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Flup", a retail clothing store management dashboard.
Your goal is to help the store manager make decisions based on sales and inventory data.
You have access to the following current inventory snapshot (simulated):
- Slim Fit Jeans: Low stock (12), High velocity. Needs reorder.
- Summer Floral Dress: Critical stock (5), High velocity. Needs immediate reorder.
- Leather Belt: Low stock (8).
- Wool Sweater: Overstock (200), Low velocity. Suggest a discount.

When asked, provide specific advice based on this data. Keep answers concise and business-focused.
`;
