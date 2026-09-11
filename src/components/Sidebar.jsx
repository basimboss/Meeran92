import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  LayoutDashboard, 
  Layers, 
  Boxes, 
  Wrench, 
  CheckCircle2, 
  Search, 
  PlusCircle,
  Smartphone
} from 'lucide-react';

export function Sidebar() {
  const { currentScreen, setCurrentScreen, counts, setIsAddMobileOpen } = useShop();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      count: null,
      badgeColor: ''
    },
    {
      id: 'all-mobiles',
      label: 'All Mobiles',
      icon: Layers,
      count: counts.total,
      badgeColor: 'bg-slate-700 text-slate-200'
    },
    {
      id: 'stock-mobiles',
      label: 'Stock Mobiles',
      icon: Boxes,
      count: counts.stock,
      badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
    },
    {
      id: 'service-mobiles',
      label: 'Service Mobiles',
      icon: Wrench,
      count: counts.service,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800/80'
    },
    {
      id: 'sold-mobiles',
      label: 'Sold Mobiles',
      icon: CheckCircle2,
      count: counts.sold,
      badgeColor: 'bg-blue-950 text-blue-300 border border-blue-800/80'
    },
    {
      id: 'find-mobile',
      label: 'Find Mobile',
      icon: Search,
      count: null,
      badgeColor: ''
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between py-6 px-4 select-none">
      <div className="space-y-6">
        
        {/* Primary Action: + Add New Mobile */}
        <button
          onClick={() => setIsAddMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all text-sm group"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          <span>+ Add New Mobile</span>
        </button>

        {/* Navigation Menu */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-300 font-medium mb-1">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>92 Refonic Store</span>
          </div>
          <p className="text-[11px] text-slate-400">Inventory & Mobile Management v1.0</p>
        </div>
      </div>
    </aside>
  );
}
