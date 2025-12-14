// --- Database Types based on SQL Schema ---

export interface SalesData {
  day: string;
  revenue: number;
  cost: number;
}

export interface Product {
  id: number; // bigint in SQL is string or number in JS, usually number if not huge
  created_at?: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  embedding?: number[]; // vector(768)
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  size?: string;
  color?: string;
  cost_price: number;
  price: number;
  current_stock: number;
  min_stock_threshold: number;
  updated_at?: string;
  // Joins
  products?: Product;
}

// For the UI, we often need a flattened view
export interface ProductWithVariant extends Product {
  variant_id: number;
  sku: string;
  stock: number;
  price: number;
  status: 'Healthy' | 'Reorder' | 'Overstock'; // Computed
}

export interface Customer {
  id: number;
  created_at?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  birth_date?: string; // IPO-8601 Format YYYY-MM-DD
}

export interface Order {
  id: number;
  created_at?: string;
  customer_id?: number;
  status: string;
  payment_method?: string;
  total_amount: number;
}

// Views
export interface LowStockView {
  product_name: string;
  sku: string;
  size?: string;
  color?: string;
  current_stock: number;
  min_stock_threshold: number;
}

export interface DailySalesView {
  day: string; // date_trunc returns timestamp string
  total_revenue: number;
  total_orders: number;
}

// Frontend specific
export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Tab {
  DASHBOARD = 'Dashboard',
  POS = 'POS',
  INVENTORY = 'Inventory',
  ORDERS = 'Orders',
  CUSTOMERS = 'Customers',
  SETTINGS = 'Settings'
}
