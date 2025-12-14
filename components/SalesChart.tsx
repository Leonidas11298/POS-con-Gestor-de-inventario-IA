import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailySales } from '../services/dashboardService';
import { DailySalesView } from '../types';

export const SalesChart: React.FC = () => {
  const [data, setData] = useState<DailySalesView[]>([]);

  useEffect(() => {
    getDailySales().then(res => {
      // Format date better if needed
      const formatted = res.map(item => ({
        ...item,
        day: new Date(item.day).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        total_revenue: Number(item.total_revenue), // ensure number
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
          <p className="text-sm text-gray-400">Daily revenue performance</p>
        </div>
        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg p-2 outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.length ? data : []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#10B981', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="total_revenue"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
