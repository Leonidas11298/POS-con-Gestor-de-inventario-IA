import React from 'react';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertCircle, ShoppingBag } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const cards = [
    {
      title: 'Total Revenue',
      value: '$3,465',
      change: '+0.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Total Orders',
      value: '1,136',
      change: '-0.2%',
      isPositive: false,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Gross Margin',
      value: '$52,187',
      change: '+2.5%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Stock Alerts',
      value: '12 Items',
      subtext: 'Need reorder',
      isPositive: false,
      isAlert: true,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon size={22} />
            </div>
            {card.change && (
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                card.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}>
                {card.isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {card.change}
              </span>
            )}
            {card.isAlert && (
               <span className="text-xs font-medium px-2 py-1 rounded-full text-orange-600 bg-orange-50">
                  Action Needed
               </span>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
            {card.subtext && <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
