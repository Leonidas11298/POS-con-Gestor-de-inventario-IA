import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_CATEGORY_DATA } from '../constants';

export const CategoryChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Sales by Category</h3>
      <div className="flex h-full">
        <div className="w-1/2 h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={MOCK_CATEGORY_DATA}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                >
                {MOCK_CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
             {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-800">100%</span>
            </div>
        </div>
        
        <div className="w-1/2 flex flex-col justify-center space-y-3 pl-4">
            {MOCK_CATEGORY_DATA.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }}></span>
                        <span className="text-gray-600">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{cat.value}%</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
