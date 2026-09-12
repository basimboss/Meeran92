import React from 'react';
import { useShop } from '../context/ShopContext';
import { Smartphone, Boxes, Wrench, ArrowUpRight } from 'lucide-react';

export function SummaryCards() {
  // Safe destructuring with fallback object initialization to prevent system crashes
  const { counts = { total: 0, stock: 0, service: 0 }, setCurrentScreen } = useShop();

  // Guard against undefined count properties gracefully by setting defaults
  const totalCount = counts?.total ?? 0;
  const stockCount = counts?.stock ?? 0;
  const serviceCount = counts?.service ?? 0;

  // Point 3: Sold mobiles removed from dashboard summary cards
  // Point 9: Stock mobiles color changed to Blue
  const cards = [
    {
      id: 'all-mobiles',
      label: 'Total Mobiles',
      value: totalCount,
      sub: 'All inventory registered',
      icon: Smartphone,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50',
    },
    {
      id: 'stock-mobiles',
      label: 'Stock Mobiles',
      value: stockCount,
      sub: 'Ready for sale',
      icon: Boxes,
      color: 'text-blue-400', // Point 9: Blue color for Stock
      bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
    },
    {
      id: 'service-mobiles',
      label: 'Service Mobiles',
      value: serviceCount,
      sub: 'Under repair / warranty',
      icon: Wrench,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => setCurrentScreen && setCurrentScreen(card.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group bg-slate-900 shadow-md relative overflow-hidden ${card.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="mt-3">
              <div className="text-3xl font-black text-white font-mono tracking-tight group-hover:scale-[1.02] transition-transform origin-left">
                {card.value}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">
                {card.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {card.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
