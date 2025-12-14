import React, { useState, useEffect } from 'react';
import { Save, Store, MapPin, Phone, Mail, Percent, DollarSign, Loader2, Image as ImageIcon } from 'lucide-react';
import { getStoreSettings, updateStoreSettings, StoreSettings } from '../../services/settingsService';

export default function SettingsLayout() {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        const data = await getStoreSettings();
        if (data) {
            setSettings(data);
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setMessage(null);
        try {
            await updateStoreSettings(settings.id, {
                store_name: settings.store_name,
                address: settings.address,
                phone: settings.phone,
                email: settings.email,
                logo_url: settings.logo_url,
                tax_rate: settings.tax_rate,
                currency: settings.currency
            });
            setMessage({ text: 'Configuración guardada correctamente', type: 'success' });

            // Dispatch event for local updates
            window.dispatchEvent(new Event('settings-updated'));

        } catch (error) {
            setMessage({ text: 'Error al guardar configuración', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400 font-medium">Cargando configuración...</div>;
    if (!settings) return <div className="p-10 text-center text-red-400">Error: No se pudo cargar la configuración.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Store className="text-emerald-600" />
                Configuración del Negocio
            </h2>

            <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">

                    {/* General Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-50">Información General</h3>

                        {/* Logo Preview */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                                {settings.logo_url ? (
                                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Store className="text-gray-400" size={32} />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo (Imagen)</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="logo_url"
                                        value={settings.logo_url || ''}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/logo.png"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Recomendado: Imágenes cuadradas, PNG o JPG.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="store_name"
                                        value={settings.store_name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="email"
                                        value={settings.email || ''}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="phone"
                                        value={settings.phone || ''}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="address"
                                        value={settings.address || ''}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Params */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-50">Finanzas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Impuesto Default (0.16 = 16%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="tax_rate"
                                        value={settings.tax_rate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Moneda (Texto)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        name="currency"
                                        value={settings.currency || 'USD'}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-8 py-5 flex items-center justify-between border-t border-gray-100">
                    <div>
                        {message && (
                            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {message.text}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
