import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  TrendingUp, 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  Clock, 
  FileText, 
  Smartphone, 
  User, 
  ArrowRightLeft,
  Boxes
} from 'lucide-react';
import { formatCurrency } from '../utils/priceParser';
import { formatReadableDate, getCurrentDateFormatted } from '../utils/formatters';

export function TradingView() {
  const { 
    setCurrentScreen, 
    calculateTradingTotals, 
    mobiles, 
    setBillPreviewData,
    setSelectedMobileForDetails,
    getTradingSales
  } = useShop();

  const totals = calculateTradingTotals();
  const today = getCurrentDateFormatted();
  const [period, setPeriod] = useState('daily');
  const [draftDate, setDraftDate] = useState(today);
  const [appliedDate, setAppliedDate] = useState(today);
  const sales = getTradingSales();
  const selectedParts = appliedDate.split('-').map(Number);
  const selectedValue = new Date(selectedParts[0], selectedParts[1] - 1, selectedParts[2]);
  const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const weekStart = new Date(selectedValue);
  weekStart.setDate(selectedValue.getDate() - selectedValue.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const rangeStart = period === 'weekly' ? dateKey(weekStart) : period === 'monthly' ? `${appliedDate.slice(0, 7)}-01` : period === 'yearly' ? `${appliedDate.slice(0, 4)}-01-01` : appliedDate;
  const rangeEnd = period === 'weekly' ? dateKey(weekEnd) : period === 'monthly' ? dateKey(new Date(selectedParts[0], selectedParts[1], 0)) : period === 'yearly' ? `${appliedDate.slice(0, 4)}-12-31` : appliedDate;
  const filteredSales = sales.filter(mobile => mobile.saleDetails.saleDate >= rangeStart && mobile.saleDetails.saleDate <= rangeEnd);
  const filteredTotal = filteredSales.reduce((sum, mobile) => sum + Number(mobile.saleDetails.sellPriceNumeric || 0), 0);
  const handleReset = () => {
    setPeriod('daily');
    setDraftDate(today);
    setAppliedDate(today);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Back to Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentScreen('dashboard')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Trading Dashboard
              </h1>
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Live Sales
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Full screen store trading turnover, sales revenue, and financial settlement analytics
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl">
          Transactions: <strong className="text-emerald-400 font-bold">{filteredSales.length}</strong>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Period</label>
          <select value={period} onChange={(event) => setPeriod(event.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
          <input type="date" value={draftDate} onChange={(event) => setDraftDate(event.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono" />
        </div>
        <button type="button" onClick={() => setAppliedDate(draftDate)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl">Apply</button>
        <button type="button" onClick={handleReset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700">Reset</button>
        <div className="ml-auto text-xs font-mono text-slate-400">Showing {filteredSales.length} transaction(s) · {formatCurrency(filteredTotal)}</div>
      </div>

      {/* 4 Large Trading Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Today's Sales</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {formatCurrency(totals.today)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Current Business Day Volume</p>
        </div>

        {/* This Week */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>This Week</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono tracking-tight">
            {formatCurrency(totals.week)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Past 7 Days Rolling Volume</p>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>This Month</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono tracking-tight">
            {formatCurrency(totals.month)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Current Calendar Month</p>
        </div>

        {/* This Year */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>This Year</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
            {formatCurrency(totals.year)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Annual Cumulative Turnover</p>
        </div>

      </div>

      {/* Detailed Sales Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sales & Revenue Breakdown</h2>
              <p className="text-xs text-slate-400">All recorded transactions contributing to trading totals</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredSales.length} Settled Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-3.5 px-4">Sale Date & Time</th>
                <th className="py-3.5 px-3">Mobile Device</th>
                <th className="py-3.5 px-3">Shop IM</th>
                <th className="py-3.5 px-3">IMEI</th>
                <th className="py-3.5 px-3">Customer Details</th>
                <th className="py-3.5 px-3">Sale Type</th>
                <th className="py-3.5 px-3">Settled Sell Price</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredSales.length > 0 ? (
                filteredSales.map((mob) => {
                  const sale = mob.saleDetails || {};
                  return (
                    <tr 
                      key={mob.id} 
                      onClick={() => setSelectedMobileForDetails(mob)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      {/* Date & Time */}
                      <td className="py-3 px-4 text-slate-300">
                        <div>{formatReadableDate(sale.saleDate || mob.inDate)}</div>
                        <div className="text-[11px] text-slate-400">{sale.saleTime || '-'}</div>
                      </td>

                      {/* Mobile Device */}
                      <td className="py-3 px-3 font-sans font-semibold text-slate-100">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                          <div>
                            <div className="truncate max-w-[180px]">{mob.mobileName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">({mob.ram}/{mob.storage})</div>
                          </div>
                        </div>
                      </td>

                      {/* Shop IM */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                          {mob.im}
                        </span>
                      </td>

                      {/* IMEI */}
                      <td className="py-3 px-3">
                        {mob.imei ? (
                          <span className="text-emerald-400 font-bold tracking-wider">
                            {mob.imei}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            None
                          </span>
                        )}
                      </td>

                      {/* Customer Details */}
                      <td className="py-3 px-3 font-sans">
                        <div className="font-medium text-slate-200">{sale.customerName || '-'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">+91 {sale.customerMobile || '-'}</div>
                      </td>

                      {/* Sale Type */}
                      <td className="py-3 px-3 font-sans">
                        {sale.saleType === 'Exchange' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Exchange</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Direct Sale
                          </span>
                        )}
                      </td>

                      {/* Sell Price (Green) */}
                      <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                        {sale.sellPrice || '₹0'}
                      </td>

                      {/* Invoice Action */}
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBillPreviewData({ mobile: mob, sale });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 ml-auto shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Bill</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                    No sales recorded for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
