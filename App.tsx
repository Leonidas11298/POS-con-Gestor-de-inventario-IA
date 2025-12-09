import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { SalesChart } from './components/SalesChart';
import { CategoryChart } from './components/CategoryChart';
import { InventoryTable } from './components/InventoryTable';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Tab } from './types';
import { Menu, Plus, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAI={() => setIsAIDrawerOpen(true)}
        isMobileOpen={isSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header Overlay for Sidebar toggle */}
        {isSidebarOpen && (
             <div 
               className="fixed inset-0 bg-black/50 z-20 md:hidden"
               onClick={() => setIsSidebarOpen(false)}
             />
        )}

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center">
            <button 
              className="mr-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
               {activeTab === Tab.DASHBOARD ? 'Business Overview' : activeTab}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
             <div className="hidden md:flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <span>This Month</span>
                <svg className="ml-2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             </div>
             <button className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">
                <Plus size={18} className="mr-1.5" />
                <span className="hidden sm:inline">Add Product</span>
             </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {activeTab === Tab.DASHBOARD ? (
                <>
                  {/* KPI Cards */}
                  <StatsCards />

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                     <div className="lg:col-span-2">
                        <SalesChart />
                     </div>
                     <div className="lg:col-span-1">
                        <CategoryChart />
                     </div>
                  </div>

                  {/* Bottom Tables */}
                  <div className="flex flex-col lg:flex-row gap-6">
                     <InventoryTable />
                  </div>
                </>
             ) : (
                <div className="flex items-center justify-center h-[60vh] text-gray-400 flex-col">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Menu size={32} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-600">Module: {activeTab}</h2>
                    <p className="mt-2">This section is under development in this demo.</p>
                </div>
             )}
          </div>
          
          <div className="h-10"></div> {/* Spacer */}
        </main>
      </div>

      {/* AI Assistant Drawer */}
      <AIChatDrawer 
        isOpen={isAIDrawerOpen} 
        onClose={() => setIsAIDrawerOpen(false)} 
      />
    </div>
  );
};

export default App;
