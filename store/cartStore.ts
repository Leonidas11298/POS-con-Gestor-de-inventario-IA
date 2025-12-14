import { create } from 'zustand';
import { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    customer: string | null;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    setCustomer: (customer: string | null) => void;
    clearCart: () => void;
    subtotal: () => number;
    tax: () => number;
    total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    customer: null,

    addItem: (product) => {
        set((state) => {
            const existingItem = state.items.find((item) => item.id === product.id);
            if (existingItem) {
                return {
                    items: state.items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return { items: [...state.items, { ...product, quantity: 1 }] };
        });
    },

    removeItem: (productId) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
        }));
    },

    updateQuantity: (productId, quantity) => {
        set((state) => ({
            items: state.items.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
            ),
        }));
    },

    setCustomer: (customer) => set({ customer }),

    clearCart: () => set({ items: [], customer: null }),

    subtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    tax: () => {
        const subtotal = get().subtotal();
        return subtotal * 0.16; // Assuming 16% VAT
    },

    total: () => {
        return get().subtotal() + get().tax();
    },
}));
