import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Tag } from 'lucide-react';
import { getCategories, createCategory, deleteCategory, Category } from '../../services/categoryService';

interface CategoryManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: () => void; // Trigger to refresh parent components
}

export default function CategoryManagerModal({ isOpen, onClose, onChange }: CategoryManagerModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setLoadingAdd(true);
        try {
            await createCategory(newCategoryName.trim());
            setNewCategoryName('');
            await loadCategories();
            onChange(); // Notify parent to refresh
        } catch (error: any) {
            alert('Error creating category: ' + error.message);
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This might affect products using this category.')) return;
        try {
            await deleteCategory(id);
            await loadCategories();
            onChange();
        } catch (error: any) {
            alert('Error deleting category: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Tag size={20} className="text-emerald-600" />
                        Gestionar Categorías
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                        <input
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="Nueva Categoría..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loadingAdd || !newCategoryName.trim()}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {loadingAdd ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </button>
                    </form>

                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>
                    ) : (
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">No hay categorías. Agrega una.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
