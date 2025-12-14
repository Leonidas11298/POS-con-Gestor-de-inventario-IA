import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../services/supabaseClient'; // Or use dashboardService if preferred

export default function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const addItem = useCartStore((state) => state.addItem);

    const categories = ['Todos', 'Pants', 'Shirts', 'Dresses', 'Accessories'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        let query = supabase.from('products').select(`
      *,
      variants (
        id,
        size,
        color,
        current_stock,
        price
      )
    `);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            // Transform data to flat Product structure for now, or handle variants
            // For simple UI, let's assume we show the main product price/stock or the first variant
            // Mapping complex variant logic might be needed later.
            // For MOCK/Simple version:
            const mappedProducts = data?.map(p => ({
                ...p,
                // Fallback for stock/price if coming from variants
                stock: p.variants?.[0]?.current_stock || 0,
                price: p.variants?.[0]?.price || 0,
                variant_id: p.variants?.[0]?.id // Important for Checkout
            })) || [];
            setProducts(mappedProducts as any);
        }
        setLoading(false);
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="h-full flex flex-col p-6 bg-gray-50 overflow-hidden">
            {/* Header & Search */}
            <div className="mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Buscar productos (Jeans, Boda, Playa)..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                {loading ? (
                    <div className="flex items-center justify-center h-40 text-gray-400">Cargando catálogo...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => {
                            // Logic for stock tag color
                            const stockLevel = product.stock;
                            let stockColor = 'bg-gray-100 text-gray-500'; // Agotado
                            if (stockLevel > 10) stockColor = 'bg-green-100 text-green-700';
                            else if (stockLevel > 0) stockColor = 'bg-orange-100 text-orange-700';

                            return (
                                <button
                                    key={product.id}
                                    onClick={() => stockLevel > 0 && addItem(product)}
                                    disabled={stockLevel <= 0}
                                    className={`group relative flex flex-col bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left ${stockLevel <= 0 ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                                >
                                    <div className="aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden relative">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/150'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${stockColor}`}>
                                            {stockLevel} un.
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                                    <p className="text-emerald-600 font-bold">${product.price?.toFixed(2)}</p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
