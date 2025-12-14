import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { SalesChart } from './components/SalesChart';
import { CategoryChart } from './components/CategoryChart';
import { InventoryTable } from './components/InventoryTable';
import { AIChatDrawer } from './components/AIChatDrawer';
import { Tab } from './types';
import { Menu, Plus, Calendar } from 'lucide-react';

import POSLayout from './components/POS/POSLayout';

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

        {/* Top Header - Hide in POS for Immersive feel, or keep simplified? User asked for continuous flow. Let's keep it but maybe simplified. */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
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
            {/* Only show Add Product on Dashboard */}
            {activeTab === Tab.DASHBOARD && (
              <button className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">
                <Plus size={18} className="mr-1.5" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className={`flex-1 overflow-hidden ${activeTab === Tab.POS ? 'p-0' : 'overflow-y-auto p-4 md:p-8'}`}>
          {activeTab === Tab.DASHBOARD && (
            <div className="max-w-7xl mx-auto">
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

              <div className="h-10"></div> {/* Spacer */}
            </div>
          )}

          {activeTab === Tab.POS && (
            <POSLayout />
          )}

          {activeTab !== Tab.DASHBOARD && activeTab !== Tab.POS && (
            <div className="flex items-center justify-center h-full text-gray-400 flex-col">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Menu size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-600">Module: {activeTab}</h2>
              <p className="mt-2">This section is under development in this demo.</p>
            </div>
          )}
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
