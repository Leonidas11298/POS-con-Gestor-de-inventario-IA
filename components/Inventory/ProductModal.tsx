import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { createProduct, updateProduct, CreateProductDTO } from '../../services/inventoryService';
import { generateProductDescription } from '../../services/geminiService';
import { getCategories, Category } from '../../services/categoryService';
import { ProductWithVariant } from '../../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: ProductWithVariant | null;
}

const CATEGORIES = ['Pants', 'Shirts', 'Dresses', 'Accessories', 'Shoes', 'Other']; // Fallback only

export default function ProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<CreateProductDTO>({
        name: '',
        category: 'Pants',
        description: '',
        image_url: '',
        sku: '',
        price: 0,
        cost_price: 0,
        current_stock: 0,
        min_stock_threshold: 5,
        size: '',
        color: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
            if (data.length > 0 && !productToEdit) {
                // Set default category if creating new
                setFormData(prev => ({ ...prev, category: data[0].name }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                category: productToEdit.category,
                description: productToEdit.description || '',
                image_url: productToEdit.image_url || '',
                sku: productToEdit.sku,
                price: productToEdit.price,
                cost_price: 0,
                current_stock: productToEdit.stock,
                min_stock_threshold: 5,
                size: '',
                color: ''
            });
        }
        // Note: Reset logic moved to open trigger or initial state to avoid flicker, simplified here
    }, [productToEdit, isOpen]);

    const [generating, setGenerating] = useState(false);

    if (!isOpen) return null;

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            alert('Ingresa el nombre del producto primero.');
            return;
        }
        setGenerating(true);
        try {
            const desc = await generateProductDescription(formData.name, formData.category);
            setFormData(prev => ({ ...prev, description: desc }));
        } catch (error) {
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, productToEdit.variant_id, formData);
            } else {
                await createProduct(formData);
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: e.target.type === 'number' ? parseFloat(value) : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">{productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-1">Información Básica</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej. Jeans Slim Fit"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                >
                                    {categories.length > 0
                                        ? categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                                        : CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                                    }
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                    Descripción
                                    <button
                                        type="button"
                                        onClick={handleGenerateDescription}
                                        disabled={generating}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
                                    >
                                        <Sparkles size={12} />
                                        {generating ? 'Generando...' : 'Generar con IA'}
                                    </button>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
                                    placeholder={generating ? "Escribiendo..." : ""}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-1">Inventario y Precios</h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                <input
                                    required
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="APP-001"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta ($)</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="cost_price"
                                    value={formData.cost_price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    name="current_stock"
                                    value={formData.current_stock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alerta Mínima</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    name="min_stock_threshold"
                                    value={formData.min_stock_threshold}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? 'Guardando...' : (productToEdit ? 'Actualizar Producto' : 'Guardar Producto')}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
