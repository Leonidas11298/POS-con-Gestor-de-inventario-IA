import React, { useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { ProductWithVariant } from '../types';
import { getInventory } from '../services/dashboardService';

export const InventoryTable: React.FC = () => {
  const [products, setProducts] = useState<ProductWithVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventory().then(res => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 bg-white rounded-2xl shadow-sm text-center">Loading Inventory...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Inventory Intelligence</h3>
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Full Report</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4 text-center">AI Suggestion</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((item) => (
              <tr key={item.variant_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.sku}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.stock < 10 ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                  ${item.price}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.status === 'Reorder' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                      Reorder
                    </span>
                  )}
                  {item.status === 'Healthy' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Healthy
                    </span>
                  )}
                  {item.status === 'Overstock' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Discount?
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-gray-400">
                  <button className="hover:bg-gray-100 p-1 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
