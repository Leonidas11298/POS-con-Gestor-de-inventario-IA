import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit2, Trash2, Loader2, Tag } from 'lucide-react';
import { ProductWithVariant } from '../../types';
import { getInventory } from '../../services/dashboardService';
import { deleteProduct } from '../../services/inventoryService';
import ProductModal from './ProductModal';
import CategoryManagerModal from './CategoryManagerModal';


interface InventoryLayoutProps {
    onOpenAddProduct?: () => void;
    onEditProduct?: (product: ProductWithVariant) => void;
    refreshTrigger?: number;
}

export default function InventoryLayout({ onOpenAddProduct, onEditProduct, refreshTrigger }: InventoryLayoutProps) {
    const [products, setProducts] = useState<ProductWithVariant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Lifted to App
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        loadInventory();
    }, [refreshTrigger]);

    const loadInventory = async () => {
        setLoading(true);
        try {
            // Reusing dashboard service for now, eventually move to inventoryService for specialized needs
            const data = await getInventory();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (product: ProductWithVariant) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) return;

        try {
            await deleteProduct(product.id);
            // Actually our service deleteProduct only takes productId and we trust cascade
            // Let's re-verify service signature. It takes productId.
            // Wait, I should double check deleteProduct signature.
            // It is: export const deleteProduct = async (productId: string) => { ... }
            await deleteProduct(product.id);
            loadInventory();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar producto');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h2>
                    <p className="text-gray-500 text-sm mt-1">Administra tu catálogo y existencias</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        <Tag size={18} />
                        Categorías
                    </button>
                    {/* <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                        <Filter size={18} />
                        filtros
                    </button> */}
                    <button
                        onClick={onOpenAddProduct}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/20 transition-all"
                    >
                        <Plus size={18} />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {/*
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    loadInventory();
                    setIsAddModalOpen(false);
                }}
            />
            */}

            <CategoryManagerModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onChange={() => {
                    // Start refresh if needed, for instance if we filter by category (future)
                    // For now just close or keep open?
                }}
            />

            {/* Toolbar */}
            <div className="px-8 py-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto px-8 pb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400">Cargando inventario...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Precio</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Estado</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.variant_id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                    {product.image_url && <img src={product.image_url} alt="" className="h-full w-full object-cover" />}
                                                </div>
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {product.stock} un.
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {product.stock === 0 ? (
                                                <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">Agotado</span>
                                            ) : product.stock <= 5 ? (
                                                <span className="text-xs text-amber-500 font-medium bg-amber-50 px-2 py-1 rounded">Bajo Stock</span>
                                            ) : (
                                                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Disponible</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEditProduct?.(product)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
                            <p className="text-gray-500 mt-1">Intenta con otra búsqueda o agrega un nuevo producto.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
