import React from 'react';
import { useShop } from '../context/ShopContext';
import { Eye, EyeOff, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/priceParser';

export function TradingDashboard() {
  const { tradingVisible, setTradingVisible, calculateTradingTotals } = useShop();
  const totals = calculateTradingTotals();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl p-4 sm:p-5 shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">Trading Dashboard</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60 font-semibold">
                Sales & Revenue
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Aggregated from sold mobile prices (Today, Week, Month, Year)
            </p>
          </div>
        </div>

        {/* Eye Action to reveal/hide */}
        <button
          onClick={() => setTradingVisible(!tradingVisible)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white transition-all text-xs font-medium shadow-sm active:scale-95"
          title={tradingVisible ? "Hide financial trading totals" : "Reveal financial trading totals"}
        >
          {tradingVisible ? (
            <>
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>Hide Totals</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Reveal Trading</span>
            </>
          )}
        </button>
      </div>

      {/* When Revealed */}
      {tradingVisible && (
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 animate-in fade-in duration-300">
          
          {/* Today */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Today</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {formatCurrency(totals.today)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Current Day Volume</div>
          </div>

          {/* This Week */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              This Week
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono tracking-tight">
              {formatCurrency(totals.week)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Rolling 7 Days</div>
          </div>

          {/* This Month */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              This Month
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono tracking-tight">
              {formatCurrency(totals.month)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Current Calendar Month</div>
          </div>

          {/* This Year */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              This Year
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
              {formatCurrency(totals.year)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Cumulative Annual Sales</div>
          </div>

        </div>
      )}
    </div>
  );
}
