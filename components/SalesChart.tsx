import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_SALES_DATA } from '../constants';

export const SalesChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Product Sales</h3>
        <div className="flex items-center gap-4 text-sm">
           <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-gray-500">Revenue</span>
           </div>
           <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
              <span className="text-gray-500">Gross Margin</span>
           </div>
        </div>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_SALES_DATA} barGap={8}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 4, 4]} barSize={12} />
            <Bar dataKey="cost" fill="#FB923C" radius={[4, 4, 4, 4]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
