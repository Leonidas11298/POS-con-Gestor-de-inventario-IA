import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, CreditCard, User, Sparkles, Loader2, CheckCircle, Download, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../services/supabaseClient';
import { sendMessageToN8N, getUpsellSuggestion } from '../../services/geminiService';
import { getCustomers } from '../../services/customerService';
import { Customer } from '../../types';
import { generateReceipt } from '../../services/receiptService';

export default function CartSection() {
    const {
        items,
        customer,
        removeItem,
        updateQuantity,
        setCustomer,
        subtotal,
        tax,
        total,
        clearCart
    } = useCartStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<{ id: number, total: number, change: number, customerName: string } | null>(null);

    // AI Upsell State
    const [upsellText, setUpsellText] = useState<string>('');
    const [loadingUpsell, setLoadingUpsell] = useState(false);

    // Customer Data
    const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        const data = await getCustomers();
        setAvailableCustomers(data);
    };

    // Dynamic AI Suggestion Effect
    React.useEffect(() => {
        if (items.length === 0) {
            setUpsellText('');
            return;
        }

        const timer = setTimeout(async () => {
            setLoadingUpsell(true);
            try {
                const productNames = items.map(i => i.name);
                const suggestion = await getUpsellSuggestion(productNames);
                setUpsellText(suggestion);
            } catch (err) {
                console.error("Error fetching upsell", err);
            } finally {
                setLoadingUpsell(false);
            }
        }, 1500); // 1.5s debounce to avoid spamming while adding items

        return () => clearTimeout(timer);
    }, [items]); // Re-run when cart items change

    const handleCheckout = async (method: string) => {
        setIsProcessing(true);
        try {
            // 1. Prepare items for RPC
            const p_items = items.map(item => ({
                variant_id: (item as any).variant_id, // Use the correct ID mapped in Catalog
                quantity: item.quantity,
                price: item.price
            }));

            // 2. Resolve Customer ID
            // customer in store is currently the name string. Find the object.
            const selectedCustomerObj = availableCustomers.find(c => c.full_name === customer);
            const customerId = selectedCustomerObj ? selectedCustomerObj.id : null;

            // 2. Call RPC
            const { data: orderId, error } = await supabase.rpc('complete_sale', {
                p_customer_id: customerId, // Pass null for walk-ins (if DB allows) or handle default
                p_payment_method: method,
                p_items: p_items
            });

            if (error) throw error;

            // 3. Notify n8n
            await sendMessageToN8N(`Nueva venta completada ID #${orderId}. Total: $${total().toFixed(2)}`, []);

            // 4. Show Success State (Don't clear yet, let them print)
            const customerName = customer || 'Cliente General';
            setCompletedOrder({
                id: orderId,
                total: total(),
                change: 0, // Placeholder
                customerName
            });
            setShowPaymentModal(false);

        } catch (err: any) {
            console.error('Checkout error:', err);
            alert('Error procesando la venta: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseSuccess = () => {
        setCompletedOrder(null);
        clearCart();
        setCustomer(''); // Reset customer too if desired
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl">
            {/* Customer Selector */}
            <div className="p-6 border-b border-gray-100">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={customer || ''}
                        onChange={(e) => setCustomer(e.target.value)}
                    >
                        <option value="">Cliente General (Público)</option>
                        {availableCustomers.map(c => (
                            <option key={c.id} value={c.full_name}>{c.full_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <p>Carrito vacío</p>
                        <p className="text-sm">Agrega productos del catálogo</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between group">
                            <div className="flex-1 min-w-0 pr-4">
                                <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} c/u</p>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="font-medium text-gray-900 w-6 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                                >
                                    <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="text-right min-w-[80px] ml-4">
                                <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* AI Upsell Zone (Dynamic) */}
            {items.length > 0 && (
                <div className="mx-6 mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 relative overflow-hidden group min-h-[80px]">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="h-12 w-12 text-indigo-600" />
                    </div>
                    <div className="flex gap-3 relative z-10 items-start">
                        <div className="bg-white p-2 rounded-full shadow-sm h-fit mt-1">
                            {loadingUpsell ? (
                                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                            ) : (
                                <Sparkles className="h-5 w-5 text-indigo-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-indigo-900 font-bold text-sm">Sugerencia IA</p>
                            <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                                {loadingUpsell
                                    ? "Analizando canasta..."
                                    : (upsellText || "¡Gran selección de productos!")}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer / Checkout */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Impuestos (16%)</span>
                        <span>${tax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-emerald-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>${total().toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={items.length === 0}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <CreditCard className="h-6 w-6" />
                    Cobrar ${(total()).toFixed(2)}
                </button>
            </div>

            {/* Basic Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Método de Pago</h3>
                        <div className="space-y-3">
                            <button onClick={() => handleCheckout('effective')} className="w-full p-4 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-500 font-bold text-gray-700 flex items-center gap-3 transition-all">
                                💵 Efectivo
                            </button>
                            <button onClick={() => handleCheckout('card')} className="w-full p-4 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-500 font-bold text-gray-700 flex items-center gap-3 transition-all">
                                💳 Tarjeta
                            </button>
                            <button onClick={() => handleCheckout('transfer')} className="w-full p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-500 font-bold text-gray-700 flex items-center gap-3 transition-all">
                                🏦 Transferencia
                            </button>
                        </div>
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="mt-6 w-full py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {completedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Venta Exitosa!</h3>
                        <p className="text-gray-500 mb-6">Orden #{completedOrder.id} registrada.</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => generateReceipt(completedOrder.id, new Date().toISOString(), completedOrder.customerName, items, completedOrder.total)}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <Download size={20} />
                                Imprimir Ticket
                            </button>
                            <button
                                onClick={handleCloseSuccess}
                                className="w-full py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-all"
                            >
                                Nueva Venta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
