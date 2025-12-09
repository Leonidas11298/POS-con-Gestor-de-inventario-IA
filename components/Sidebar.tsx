import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Zap
} from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onOpenAI: () => void;
  isMobileOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAI, isMobileOpen }) => {
  const menuItems = [
    { name: Tab.DASHBOARD, icon: LayoutDashboard },
    { name: Tab.POS, icon: ShoppingCart },
    { name: Tab.INVENTORY, icon: Package },
    { name: Tab.ORDERS, icon: ShoppingBag },
    { name: Tab.CUSTOMERS, icon: Users },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
  `;

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-gray-50">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
             <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-gray-800">Flup</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Marketing</p>
          
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors duration-200 ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600 font-medium' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </button>
            );
          })}

          <div className="pt-6">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">System</p>
            <button className="w-full flex items-center px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                <Settings size={20} className="mr-3" />
                Settings
            </button>
          </div>
        </nav>

        {/* AI Action */}
        <div className="px-4 mb-4">
           <button 
             onClick={onOpenAI}
             className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
           >
              <div className="flex items-center">
                 <Zap size={20} className="mr-2 text-yellow-300" />
                 <span className="font-medium text-sm">Ask AI Assistant</span>
              </div>
              <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
           </button>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center">
            <img src="https://picsum.photos/40/40" alt="User" className="w-10 h-10 rounded-full mr-3 object-cover" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">Harper Nelson</h4>
              <p className="text-xs text-gray-400">Admin Manager</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
