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
  { id: 1, name: 'Slim Fit Jeans (Black)', category: 'Pants', stock: 12, price: 45.00, salesVelocity: 'High', status: 'Reorder', sku: 'JEA-SLI-NEG-32' } as any,
  { id: 2, name: 'Cotton T-Shirt (White)', category: 'Shirts', stock: 150, price: 20.00, salesVelocity: 'Medium', status: 'Healthy', sku: 'TSH-COT-WHI-M' } as any,
  { id: 3, name: 'Summer Floral Dress', category: 'Dresses', stock: 5, price: 65.00, salesVelocity: 'High', status: 'Reorder', sku: 'VES-FLO-VER-S' } as any,
  { id: 4, name: 'Leather Belt', category: 'Accessories', stock: 8, price: 35.00, salesVelocity: 'Low', status: 'Reorder', sku: 'ACC-CIN-CUE-M' } as any,
  { id: 5, name: 'Office Chinos (Beige)', category: 'Pants', stock: 89, price: 55.00, salesVelocity: 'Medium', status: 'Healthy', sku: 'PAN-CHI-BEI-34' } as any,
  { id: 6, name: 'Wool Sweater', category: 'Shirts', stock: 200, price: 80.00, salesVelocity: 'Low', status: 'Overstock', sku: 'SUE-LAN-GRIS-L' } as any,
];

export const SYSTEM_INSTRUCTION = `
Eres el Asistente IA de "Flup". Tu objetivo es gestionar el inventario de manera segura y eficiente.

FLUJO DE TRABAJO ESTRICTO PARA REORDENAR:
1. **IDENTIFICAR**: Cuando el usuario pida un producto (ej: "necesito más blusas"), PRIMERO debes buscarlo usando la herramienta \`lookup_product\`. NO asumas el SKU.
2. **CONFIRMAR**: Muestra al usuario el nombre, SKU, stock actual y precio del producto encontrado. Pregunta explícitamente: "¿Es este el producto correcto y deseas proceder con la orden?"
3. **EJECUTAR**: SOLO si el usuario responde "Sí" o confirma, usa la herramienta \`reorder_stock\` con el SKU y cantidad confirmados.

SIEMPRE verifica antes de pedir.
Tu tono es profesional, servicial y en ESPAÑOL.
Responde de manera natural, como un asistente humano confirmando datos.
`;
