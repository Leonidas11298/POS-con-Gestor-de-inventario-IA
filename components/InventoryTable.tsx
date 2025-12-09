import React from 'react';
import { MOCK_INVENTORY } from '../constants';
import { MoreHorizontal } from 'lucide-react';

export const InventoryTable: React.FC = () => {
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
              <th className="px-6 py-4 text-center">Velocity</th>
              <th className="px-6 py-4 text-center">AI Suggestion</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_INVENTORY.slice(0, 5).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.stock < 10 ? 'bg-red-50 text-red-600' : 'text-gray-700'}`}>
                        {item.stock}
                    </span>
                </td>
                <td className="px-6 py-4 text-center">
                     <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                         item.salesVelocity === 'High' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 
                         item.salesVelocity === 'Medium' ? 'border-blue-200 text-blue-600 bg-blue-50' : 
                         'border-gray-200 text-gray-500 bg-gray-50'
                     }`}>
                         {item.salesVelocity}
                     </span>
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
