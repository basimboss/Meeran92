import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { AllMobilesView } from './views/AllMobilesView';
import { StockMobilesView } from './views/StockMobilesView';
import { ServiceMobilesView } from './views/ServiceMobilesView';
import { SoldMobilesView } from './views/SoldMobilesView';
import { FindMobileView } from './views/FindMobileView';
import { TradingView } from './views/TradingView';
import { CustomersView } from './views/CustomersView';

// Modals
import { AddMobileModal } from './components/AddMobileModal';
import { MobileDetailsModal } from './components/MobileDetailsModal';
import { EditMobileModal } from './components/EditMobileModal';
import { ReturnMobileModal } from './components/ReturnMobileModal';
import { SellMobileModal } from './components/SellMobileModal';
import { BillPreviewModal } from './components/BillPreviewModal';
import { ImeiStickerModal } from './components/ImeiStickerModal';
import { PersonHistoryModal } from './components/PersonHistoryModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { DeleteModal } from './components/DeleteModal';

function MainLayout() {
  const { currentScreen, loading } = useShop();

  // Loading screen while Firebase data loads
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-2xl">92</span>
          </div>
          <p className="text-indigo-300 text-sm font-bold tracking-wider">92 Refonic Portal</p>
          <p className="text-slate-400 text-xs font-mono">Connecting to database...</p>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay:'0ms'}}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay:'150ms'}}></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay:'300ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardView />;
      case 'all-mobiles':
        return <AllMobilesView />;
      case 'stock-mobiles':
        return <StockMobilesView />;
      case 'service-mobiles':
        return <ServiceMobilesView />;
      case 'sold-mobiles':
        return <SoldMobilesView />;
      case 'customers':
        return <CustomersView />;
      case 'find-mobile':
        return <FindMobileView />;
      case 'trading':
        return <TradingView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar with integrated horizontal navigation tabs */}
      <Navbar />

      {/* Main Full-Width Content View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveScreen()}
      </main>

      {/* Global Modals & Overlays */}
      <AddMobileModal />
      <MobileDetailsModal />
      <EditMobileModal />
      <ReturnMobileModal />
      <SellMobileModal />
      <BillPreviewModal />
      <ImeiStickerModal />
      <PersonHistoryModal />
      <BarcodeScannerModal />
      <DeleteModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
