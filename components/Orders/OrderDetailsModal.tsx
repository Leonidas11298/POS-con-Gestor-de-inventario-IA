import React, { useEffect, useState } from 'react';
import { X, Package, Loader2, Calendar, User, CreditCard, DollarSign, Download, Mail } from 'lucide-react';
import { generateReceipt, generateEmailLink } from '../../services/receiptService';
import { OrderWithDetails, OrderItemDetail, getOrderItems } from '../../services/ordersService';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderWithDetails | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    const [items, setItems] = useState<OrderItemDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && order) {
            loadItems();
        }
    }, [isOpen, order]);

    const loadItems = async () => {
        if (!order) return;
        setLoading(true);
        try {
            const data = await getOrderItems(order.id);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            Ticket #{order.id}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {order.status === 'completed' ? 'Completado' : order.status}
                            </span>
                        </h3>
                        <p className="text-sm text-gray-500 flex gap-4 mt-1">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.created_at!).toLocaleString()}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50/50">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Cliente</p>
                            <p className="font-semibold text-gray-900">{order.customer_name}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Total Pagado</p>
                            <p className="font-semibold text-gray-900">${order.total_amount.toFixed(2)} <span className="text-xs font-normal text-gray-500">({order.payment_method})</span></p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="p-6 overflow-y-auto flex-1">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Detalle de Productos</h4>

                    {loading ? (
                        <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-emerald-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400"><Package size={20} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            <p className="text-sm text-gray-500">{item.quantity} x ${item.unit_price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                        Cerrar
                    </button>
                    <div className="flex gap-2">
                        {order.customers?.email && (
                            <a
                                href={generateEmailLink(order.id, order.customers.email, order.customers.full_name)}
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg font-bold hover:bg-indigo-100 transition flex items-center gap-2"
                            >
                                <Mail size={18} />
                                Email
                            </a>
                        )}
                        <button
                            onClick={() => generateReceipt(order.id, order.created_at, order.customers?.full_name || 'Cliente General', items, order.total_amount)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2"
                        >
                            <Download size={18} />
                            Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
