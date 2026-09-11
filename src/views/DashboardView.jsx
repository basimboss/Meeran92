import React from 'react';
import { useShop } from '../context/ShopContext';
import { SummaryCards } from '../components/SummaryCards';
import { RecentActivity } from '../components/RecentActivity';
import { 
  TrendingUp, 
  Smartphone, 
  Barcode
} from 'lucide-react';

export function DashboardView() {
  const { 
    setCurrentScreen, 
    setIsAddMobileOpen,
    setIsBarcodeScannerOpen
  } = useShop();

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Left Side Corner Action Buttons: [Trading], [Scan Barcode], [+ Add Mobile] */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Side Corner Action Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Trading Button */}
          <button
            type="button"
            onClick={() => setCurrentScreen('trading')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-amber-600/30 active:scale-95 transition-all"
            title="Open Full Screen Trading Dashboard"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trading</span>
          </button>

          {/* Point 1: Left Side Corner Scan Barcode Button */}
          <button
            type="button"
            onClick={() => setIsBarcodeScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 active:scale-95 transition-all shadow-sm"
            title="Scan Barcode / IMEI"
          >
            <Barcode className="w-4 h-4 text-indigo-400" />
            <span>Scan Barcode</span>
          </button>

          {/* Point 1: Left Side Corner Add Mobile Button */}
          <button
            type="button"
            onClick={() => setIsAddMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            title="Add New Mobile"
          >
            <Smartphone className="w-4 h-4" />
            <span>+ Add Mobile</span>
          </button>
        </div>

        {/* Dashboard Title & Welcome */}
        <div className="sm:text-right">
          <div className="flex items-center sm:justify-end gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Store Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Mobile shop inventory & live store operations
          </p>
        </div>

      </div>

      {/* SUMMARY CARDS (Total Mobiles, Stock Mobiles, Service Mobiles) */}
      <SummaryCards />

      {/* RECENT ACTIVITY (Point 4: Active stock mobiles table removed) */}
      <RecentActivity />

    </div>
  );
}
