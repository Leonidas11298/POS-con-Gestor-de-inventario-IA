import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, Edit2, Trash2, Cake, Users } from 'lucide-react';
import { Customer } from '../../types';
import { getCustomers, deleteCustomer } from '../../services/customerService';
import CustomerModal from './CustomerModal';

export default function CustomersLayout() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await deleteCustomer(id);
                loadCustomers();
            } catch (error) {
                alert('No se puede eliminar el cliente (posiblemente tiene ventas asociadas).');
            }
        }
    };

    const handleEdit = (customer: Customer) => {
        setCustomerToEdit(customer);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCustomerToEdit(null);
        setIsModalOpen(true);
    };

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
                    <p className="text-gray-500 text-sm mt-1">Directorio de clientes frecuentes y ocasionales</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <Plus size={18} />
                    Nuevo Cliente
                </button>
            </div>

            {/* Toolbar */}
            <div className="px-8 py-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid/List */}
            <div className="flex-1 overflow-auto px-8 pb-8">
                {loading ? (
                    <div className="p-10 text-center text-gray-400">Cargando clientes...</div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">No se encontraron clientes</h3>
                        <p className="text-gray-500 mt-1">Agrega uno nuevo para comenzar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                                            {customer.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{customer.full_name}</h3>
                                            <p className="text-xs text-gray-500">Registrado: {new Date(customer.created_at!).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-white shadow-sm p-1 rounded-lg border border-gray-100">
                                        <button onClick={() => handleEdit(customer)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600 transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(customer.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    {customer.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-400" />
                                            <span className="truncate">{customer.email}</span>
                                        </div>
                                    )}
                                    {customer.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400" />
                                            <span>{customer.phone}</span>
                                        </div>
                                    )}
                                    {customer.birth_date && (
                                        <div className="flex items-center gap-2 text-pink-600 bg-pink-50 px-2 py-1 rounded-lg w-fit mt-2">
                                            <Cake size={16} />
                                            <span className="font-medium text-xs">Cumpleaños: {new Date(customer.birth_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    loadCustomers();
                    setIsModalOpen(false);
                }}
                customerToEdit={customerToEdit}
            />
        </div>
    );
}
