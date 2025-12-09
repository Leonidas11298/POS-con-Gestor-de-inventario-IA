export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  salesVelocity: 'High' | 'Medium' | 'Low';
  status: 'Healthy' | 'Reorder' | 'Overstock';
}

export interface SalesData {
  day: string;
  revenue: number;
  cost: number;
}

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
